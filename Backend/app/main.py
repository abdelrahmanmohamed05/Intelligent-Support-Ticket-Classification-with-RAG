import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging import setup_logging
from app.routes.health import router as health_router
from app.routes.model_info import router as model_info_router
from app.routes.predict import router as predict_router
from app.services.inference_service import InferenceState
from app.services.model_loader import load_runtime_models

setup_logging()
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)
    app.state.inference_state = None
    try:
        runtime_models = load_runtime_models()
        app.state.inference_state = InferenceState(runtime=runtime_models)
        logger.info(
            "Runtime pipeline ready | classifier=%s | vectorizer=%s | response=%s",
            runtime_models.classifier.name,
            runtime_models.vectorizer.name,
            runtime_models.response_model.name,
        )
    except Exception as exc:
        logger.exception("Failed to initialize runtime pipeline: %s", exc)
    yield
    logger.info("Shutting down application")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=settings.api_prefix.rstrip("/"))
app.include_router(predict_router, prefix=settings.api_prefix.rstrip("/"))
app.include_router(model_info_router, prefix=settings.api_prefix.rstrip("/"))
