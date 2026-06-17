import logging
from dataclasses import dataclass
from typing import Any

import numpy as np

from app.schemas.ticket import PredictionRequest, PredictionResponse
from app.services.model_loader import RuntimeModels
from app.services.response_service import generate_response
from app.services.vectorizer_service import vectorize_text
from app.utils.text import preprocess_text

logger = logging.getLogger(__name__)


@dataclass
class InferenceState:
    runtime: RuntimeModels


def _infer_priority(category: str, confidence: float) -> str:
    category_normalized = category.lower()
    if any(token in category_normalized for token in ["billing", "refund", "payment"]):
        return "high"
    if any(token in category_normalized for token in ["technical", "account", "login"]):
        return "medium"
    if confidence < 0.55:
        return "medium"
    return "low"


def _predict_category(classifier: Any, vectorized_text: Any, raw_text: str) -> tuple[str, float]:
    logger.info("Classification step started")
    if hasattr(classifier, "predict_proba") and hasattr(classifier, "predict"):
        try:
            probabilities = classifier.predict_proba(vectorized_text)[0]
            category = str(classifier.predict(vectorized_text)[0])
            confidence = float(np.max(probabilities))
            logger.info("Classification complete | category=%s | confidence=%.4f", category, confidence)
            return category, confidence
        except Exception:
            probabilities = classifier.predict_proba([raw_text])[0]
            category = str(classifier.predict([raw_text])[0])
            confidence = float(np.max(probabilities))
            logger.info(
                "Classification complete via raw-text fallback | category=%s | confidence=%.4f",
                category,
                confidence,
            )
            return category, confidence

    if hasattr(classifier, "predict"):
        try:
            category = str(classifier.predict(vectorized_text)[0])
            logger.info("Classification complete | category=%s", category)
            return category, 0.5
        except Exception:
            category = str(classifier.predict([raw_text])[0])
            logger.info("Classification complete via raw-text fallback | category=%s", category)
            return category, 0.5

    raise RuntimeError("Classification model does not expose a compatible predict API.")


def run_inference(state: InferenceState, payload: PredictionRequest) -> PredictionResponse:
    combined_text = f"{payload.title.strip()} {payload.description.strip()}"
    normalized_text = preprocess_text(combined_text)

    vectorized = vectorize_text(state.runtime.vectorizer.object, normalized_text)
    category, confidence = _predict_category(state.runtime.classifier.object, vectorized, normalized_text)
    priority = _infer_priority(category, confidence)

    solution, suggested_response = generate_response(
        response_model=state.runtime.response_model.object,
        response_corpus=state.runtime.response_corpus,
        text=normalized_text,
        category=category,
        confidence=confidence,
    )

    return PredictionResponse(
        category=category,
        priority=priority,
        confidence=round(confidence, 4),
        agent_solution=solution,
        customer_reply=suggested_response,
        model_used=state.runtime.classifier.name,
        vectorizer_used=state.runtime.vectorizer.name,
    )
