Linux:

1. Backend
   1.1 python3 -m venv venv
   1.2 python -m install pip --upgrade pip
   1.3 pip install -r requirements.txt
   1.4 uvicorn.run("main:app", port=5000)
   1.5 bash build.sh (out check path)

2. Frontend
   2.1 npm install
   2.2 change path in package.json
   2.3 npm run build
   2.4 change path in dist/index.html
