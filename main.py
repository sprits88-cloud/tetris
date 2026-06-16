from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="Tetris Game")

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.get("/")
async def read_root():
    """Serve the landing page"""
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/game")
async def read_game():
    """Serve the tetris game page"""
    return FileResponse(os.path.join(BASE_DIR, "game.html"))

@app.get("/landing.css")
async def read_landing_css():
    """Serve landing page CSS"""
    return FileResponse(os.path.join(BASE_DIR, "landing.css"))

@app.get("/style.css")
async def read_style_css():
    """Serve game CSS"""
    return FileResponse(os.path.join(BASE_DIR, "style.css"))

@app.get("/tetris.js")
async def read_tetris_js():
    """Serve game JavaScript"""
    return FileResponse(os.path.join(BASE_DIR, "tetris.js"))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
