from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from app.routes import api_router
from app.templates import templates

app = FastAPI(title="Food Freshness Monitoring Platform")

app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.include_router(api_router)

@app.get("/", include_in_schema=False)
def read_root(request: Request):
    return templates.TemplateResponse(request, "app.html", {"request": request})

@app.get("/dashboard.html", include_in_schema=False)
def read_dashboard(request: Request):
    return templates.TemplateResponse(request, "dashboard.html")
