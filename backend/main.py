"""FastAPI application for the Animal Species Recognition System.

Endpoints:
  GET  /health                — backend availability check
  POST /predict               — upload an image, return species + confidence
  GET  /predictions          — recognition history
  GET  /predictions/{id}     — a specific prediction
  DELETE /predictions/{id}   — delete a prediction
  GET  /statistics           — dashboard statistics + chart data
"""
import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import database
from model import predict as run_prediction, is_custom_model

app = FastAPI(title="Animal Species Recognition System API", version="1.0.0")

# CORS — allow the deployed React frontend to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Client-Info", "Apikey"],
)

# Serve uploaded images so the frontend can display them via image_url.
app.mount("/uploads", StaticFiles(directory=str(database.IMAGES_DIR)), name="uploads")


@app.on_event("startup")
def startup() -> None:
    database.init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model": "custom" if is_custom_model() else "imagenet-efficientnet-b0"}


@app.post("/predict")
async def predict(image: UploadFile = File(...)) -> dict:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid JPG, JPEG or PNG image.")

    data = await image.read()
    if not data:
        raise HTTPException(status_code=400, detail="Please select an animal image first.")

    try:
        species, confidence = run_prediction(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to recognize the image. Please try again.")

    # Persist the uploaded image so history/dashboard can render it.
    safe_name = Path(image.filename or "upload.jpg").name
    unique_name = f"{uuid.uuid4().hex}_{safe_name}"
    saved_path = database.IMAGES_DIR / unique_name
    saved_path.write_bytes(data)
    rel_path = f"/uploads/{unique_name}"

    record = database.insert_prediction(
        image_name=safe_name,
        image_path=rel_path,
        species=species,
        confidence=round(confidence, 2),
    )
    record["image_url"] = rel_path
    return record


@app.get("/predictions")
def list_predictions() -> list[dict]:
    rows = database.list_predictions()
    for r in rows:
        r["image_url"] = r.get("image_path")
    return rows


@app.get("/predictions/{pid}")
def get_prediction(pid: int) -> dict:
    row = database.get_prediction(pid)
    if not row:
        raise HTTPException(status_code=404, detail="Prediction not found.")
    row["image_url"] = row.get("image_path")
    return row


@app.delete("/predictions/{pid}")
def delete_prediction(pid: int) -> dict:
    ok = database.delete_prediction(pid)
    if not ok:
        raise HTTPException(status_code=404, detail="Prediction not found.")
    return {"deleted": True, "id": pid}


@app.get("/statistics")
def statistics() -> dict:
    rows = database.list_predictions()
    total = len(rows)
    species_counts: dict[str, int] = {}
    confidences: list[float] = []
    trend: dict[str, int] = {}

    for r in rows:
        s = r["species"]
        species_counts[s] = species_counts.get(s, 0) + 1
        confidences.append(float(r["confidence"]))
        day = (r["created_at"] or "")[:10]
        if day:
            trend[day] = trend.get(day, 0) + 1

    unique_species = len(species_counts)
    avg_conf = (sum(confidences) / len(confidences)) if confidences else 0.0
    most_recognized = max(species_counts, key=species_counts.get) if species_counts else None

    distribution = sorted(
        [{"species": k, "count": v} for k, v in species_counts.items()],
        key=lambda x: x["count"],
        reverse=True,
    )
    percentage = [
        {"species": d["species"], "percentage": round(d["count"] / total * 100, 2) if total else 0.0}
        for d in distribution
    ]
    trend_list = [{"date": d, "count": c} for d, c in sorted(trend.items())]

    return {
        "total_predictions": total,
        "unique_species": unique_species,
        "average_confidence": round(avg_conf, 2),
        "most_recognized_species": most_recognized,
        "species_distribution": distribution,
        "species_percentage": percentage,
        "recognition_trend": trend_list,
    }
