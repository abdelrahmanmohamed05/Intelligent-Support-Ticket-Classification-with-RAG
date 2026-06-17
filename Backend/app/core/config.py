from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Support Ticket Classification API"
    app_version: str = "1.0.0"
    environment: str = "development"
    log_level: str = "INFO"

    api_prefix: str = "/"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    backend_root: Path = Path(__file__).resolve().parents[2]
    artifacts_dir: Path = backend_root / "artifacts"
    metrics_dir: Path = backend_root / "metrics"

    model_extensions: tuple[str, ...] = (".joblib", ".pkl", ".pickle")
    health_check_interval_seconds: int = 10

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
