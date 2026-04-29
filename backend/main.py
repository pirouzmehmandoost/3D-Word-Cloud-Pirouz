from fastapi import FastAPI

app = FastAPI(title="3D Word Cloud Backend")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
