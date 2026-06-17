from fastapi import APIRouter, Request

from app.schemas.ticket import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check(request: Request) -> HealthResponse:
    state = getattr(request.app.state, "inference_state", None)
    return HealthResponse(
        status="ok",
        model_loaded=bool(state),
        model_name=state.runtime.classifier.name if state else None,
        vectorizer_name=state.runtime.vectorizer.name if state else None,
        response_model_name=state.runtime.response_model.name if state else None,
    )
