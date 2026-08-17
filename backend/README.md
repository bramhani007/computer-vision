# Animal Species Recognition System — FastAPI Backend

AI backend that classifies animal species from uploaded images using an
**EfficientNet-B0** model (TensorFlow + Keras) with **OpenCV** preprocessing,
and stores prediction history in **SQLite**.

## Endpoints

| Method | Path                  | Purpose                                    |
|--------|-----------------------|--------------------------------------------|
| GET    | `/health`             | Backend availability check                 |
| POST   | `/predict`            | Upload image → species + confidence        |
| GET    | `/predictions`        | Recognition history                        |
| GET    | `/predictions/{id}`   | A specific prediction                      |
| DELETE | `/predictions/{id}`   | Delete a prediction                        |
| GET    | `/statistics`         | Dashboard statistics + chart data          |

## Quick start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`.

## How the model works

On first request, the backend loads a model in this order:

1. **Custom trained model** — `backend/model/animal_model.h5` if present
   (produced by `train.py`). Labels come from `backend/model/labels.json`.
2. **ImageNet-pretrained EfficientNetB0** fallback — used until a custom
   model is trained. It still produces a **real** prediction from the 1000
   ImageNet classes (many of which are animals); it is never a mock.

This means the API always returns a genuine model inference — no fake or
random results.

## Training a custom animal model (optional)

Organize your dataset as:

```
data/
  train/
    tiger/
      img1.jpg
    lion/
      ...
  val/
    tiger/
      ...
    lion/
      ...
```

Then run:

```bash
python train.py --data-dir ./data --epochs 20 --batch-size 32
```

This saves `backend/model/animal_model.h5` and `backend/model/labels.json`.
Restart the backend and it will automatically use the custom model.

## Connecting the frontend

Set the backend URL in the React app's environment:

```
VITE_API_BASE_URL=https://your-deployed-fastapi-url
```

The frontend checks `/health` on startup and shows a live connection status.
When the backend is offline, a clear error is shown — the app never falls back
to mock data.

## Deployment notes

- Deploy this backend to any host that supports Python (Render, Railway, Fly.io,
  a VPS, etc.). TensorFlow's CPU wheel works fine for low-volume inference.
- For GPU acceleration, install a CUDA-enabled TensorFlow build instead.
- Uploaded images are stored in `backend/uploads/` and served at `/uploads/`.
- SQLite database is created automatically at `backend/predictions.db`.
  For production with multiple workers, switch to PostgreSQL or a shared volume.
