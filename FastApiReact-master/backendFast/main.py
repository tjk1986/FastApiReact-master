# imports
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, HTTPException, Header, Request, Form
from fastapi.responses import FileResponse
from typing import Annotated

# these are needed for pyinstaller
from scipy.special import _cdflib
import importlib.resources

import pandas as pd
import pathlib
import pickle
import json
import uuid
import os
import io

# local imports
from getFiles import createFileRecords
from train import train, test_model
from models import TestModel, SettingsModel, PredictModel

# constants
UPLOAD_FOLDER = f"{os.getcwd()}/uploads/"
MODEL_PATH = f"{os.getcwd()}/ml_models/"
SETTINGS_PATH = f"{os.getcwd()}/settings/"
VECTOR_PATH = f"{os.getcwd()}/vectors/"
TESTS_PATH = f"{os.getcwd()}/tests/"
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
MAX_SIZE = 2000

os.makedirs(os.path.dirname(UPLOAD_FOLDER), exist_ok=True)
os.makedirs(os.path.dirname(SETTINGS_PATH), exist_ok=True)
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
os.makedirs(os.path.dirname(VECTOR_PATH), exist_ok=True)
os.makedirs(os.path.dirname(TESTS_PATH), exist_ok=True)

app = FastAPI(title="FastAPI: ML models")

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root(user_agent: Annotated[str | None, Header()] = None):
    return {"Hello": user_agent}

# FILE routes


@app.get("/file", tags=["file"])
async def read_file(request: Request):
    try:
        file = request.headers.get('file')
        path = os.path.join(UPLOAD_FOLDER, file)

        df = pd.read_csv(path)

        data = df[:MAX_SIZE].to_json(orient="table")
        parsed = json.loads(data)

        settings = open_settings(file)

        return {'table': parsed, 'settings': settings}

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail=f"{file.content_type} not allowed")


@app.get("/file/test", tags=["file"])
async def read_test_file(request: Request):
    try:
        file = request.headers.get('file')
        path = os.path.join(TESTS_PATH, file)

        df = pd.read_csv(path)

        data = df[:MAX_SIZE].to_json(orient="table")
        parsed = json.loads(data)

        return parsed

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail=f"{file.content_type} not allowed")


@app.post("/file", tags=["file"])
async def save(request: Request):
    try:
        body = await request.json()
        data = body['curState']['data']
        data = json.dumps(data)
        df = pd.read_json(io.StringIO(data), orient="table")

        file = body['curState']['fileSelected'].split('.')
        path = os.path.join(UPLOAD_FOLDER, f"{file}.csv")
        settings_path = os.path.join(SETTINGS_PATH, f"{file}.json")

        # Open settings
        with open(settings_path) as f:
            settings = json.load(f)

        label = settings['target']

        full_df = pd.read_csv(path)
        full_df.loc[:, [label, 'pred']
                    ] = df.loc[:, [label, 'pred']]

        full_df.to_csv(path, index=False)

        return {"success": "file saved"}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="error")


@app.delete("/file", tags=["file"])
async def delete(request: Request):
    try:
        body = await request.json()
        file = body['file'].split('.')[0]
        pathlib.Path(os.path.join(UPLOAD_FOLDER, body['file'])).unlink(
            missing_ok=True)
        pathlib.Path(os.path.join(TESTS_PATH, body['file'])).unlink(
            missing_ok=True)
        pathlib.Path(os.path.join(MODEL_PATH, f"{file}.pkl")).unlink(
            missing_ok=True)
        pathlib.Path(os.path.join(SETTINGS_PATH, f"{file}.json")).unlink(
            missing_ok=True)
        pathlib.Path(os.path.join(VECTOR_PATH, f"{file}.pkl")).unlink(
            missing_ok=True)

        return {"response": "success"}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="error")

# FILES route


@app.get("/files", tags=["file"])
async def get_files():
    files = createFileRecords(UPLOAD_FOLDER)
    test_files = createFileRecords(TESTS_PATH)
    return {"files": files, "test_files": test_files}

# UPLOAD route


@app.post("/upload", tags=["upload"])
async def upload(file: UploadFile, file_name: Annotated[str, Form()], test_size: Annotated[str, Form()]):
    if file.content_type == 'text/csv':
        # convert filename
        file_name = file_name.replace(' ', '_')
        [file_name, file_extension] = file_name.split('.')
        file_id = uuid.uuid4()

        # path and save file
        path = os.path.join(
            UPLOAD_FOLDER, f"{file_name}_{file_id}.{file_extension}")
        test_path = os.path.join(
            TESTS_PATH, f"{file_name}_{file_id}_test.{file_extension}")

        with open(path, 'wb') as f:
            contents = await file.read()
            f.write(contents)

        df = pd.read_csv(path)
        if 'pred' not in df.columns:
            df['pred'] = ""

        df = df.dropna()
        test_cut = int(df.shape[0] * float(test_size))
        df[:-test_cut].to_csv(path, index=False)
        df[-test_cut:].to_csv(test_path, index=False)

        # create settings file
        settings = {}
        settings['file'] = f"{file_name}_{file_id}.{file_extension}"
        settings['description'] = ""
        settings['status'] = 0
        settings['target'] = ""
        settings['ouput_type'] = ""
        settings['model'] = ""
        settings['shift'] = 0
        settings['labels'] = []
        settings['columns'] = []

        for idx, column in enumerate(df.columns):
            col = {'index': idx, 'column': column, 'type': '',
                   'visible': True, 'training': False}
            settings['columns'].append(col)

        settings_path = os.path.join(
            SETTINGS_PATH, f"{file_name}_{file_id}.json")
        with open(settings_path, 'w') as f:
            json.dump(settings, f)

        return {"success": file.filename}

    raise HTTPException(
        status_code=404, detail=f"{file.content_type} not allowed")


@app.post("/upload/test", tags=["upload"])
async def upload_test(file: UploadFile, file_name: Annotated[str, Form()]):
    if file.content_type == 'text/csv':
        # convert filename
        file_name = file.filename.replace(' ', '_')
        [file_name, file_extension] = file_name.split('.')
        file_id = uuid.uuid4()

        # path and save file
        path = os.path.join(
            TESTS_PATH, f"{file_name}_{file_id}.{file_extension}")

        with open(path, 'wb') as f:
            contents = await file.read()
            f.write(contents)

        return {"success": file.filename}

    raise HTTPException(
        status_code=404, detail=f"{file.content_type} not allowed")

# SETTINGS route


@app.post('/setting', tags=["settings"])
async def set_settings(body: SettingsModel) -> SettingsModel:
    settings_file = f"{body.file.split('.')[0]}.json"
    settings_path = os.path.join(SETTINGS_PATH, settings_file)

    settings = json.loads(body.model_dump_json())

    with open(settings_path, 'w') as f:
        json.dump(settings, f)

    return body


@app.get('/setting', tags=["settings"])
async def get_setting(file: str) -> SettingsModel:
    file = file.split('.')[0]
    path = os.path.join(SETTINGS_PATH, f"{file}.json")

    with open(path, 'rb') as f:
        data = json.load(f)

    return data


@app.get('/settings', tags=["settings"])
async def get_settings() -> list[SettingsModel]:
    files = createFileRecords(UPLOAD_FOLDER)

    settings = []
    for file in files:
        setting = open_settings(file['File Name'])
        settings.append(setting)

    return settings


# PREDICT and TEST route
@app.post("/train", tags=["ML"])
async def train_classification(request: Request):
    """Train route post data"""
    try:
        body = await request.json()
        data = body['curState']['data']
        data = json.dumps(data)
        filename = body['curState']['fileSelected']
        file = filename.split('.')[0]
        path = os.path.join(UPLOAD_FOLDER, f"{file}.csv")
        settings_path = os.path.join(SETTINGS_PATH, f"{file}.json")

        # Open settings
        with open(settings_path) as f:
            settings = json.load(f)

        label = settings['target']

        df = pd.read_json(io.StringIO(data), orient="table")
        del data

        full_df = pd.read_csv(path)

        if settings['ouput_type'] == 'Categorical':
            if label not in full_df.columns:
                full_df[label] = ""

            full_df.loc[:, label] = df.loc[:, label]

        del df

        pred = train(full_df, filename, MODEL_PATH, VECTOR_PATH, SETTINGS_PATH)

        # Add pred to columns if not exist
        if 'pred' not in full_df.columns:
            position = len(full_df.columns) - 1
            full_df.insert(position, "pred", pred)
        else:
            full_df['pred'] = pred

        full_df.to_csv(path, index=False)

        with open(settings_path, 'w') as f:
            settings['status'] = 1
            json.dump(settings, f)

        # Pred column inilization changes type to numeric, return schema
        # This is dirty fix and fixed later
        data = full_df[:MAX_SIZE].to_json(orient="table")
        parsed = json.loads(data)
        schema = parsed['schema']['fields']

        return {'values': [i for i in full_df[:MAX_SIZE]['pred']], 'schema': schema}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="error")


@app.post("/test", tags=["ML"])
async def test(body: TestModel):
    try:

        trained_model = body.trained_model
        test_data = body.test_data

        path = os.path.join(TESTS_PATH, test_data)

        df = pd.read_csv(path)

        pred = test_model(df, trained_model, MODEL_PATH,
                          VECTOR_PATH, SETTINGS_PATH)

        _type = 'string'
        try:
            value = int(pred["pred"][0])
            _type = 'number'
        except ValueError:
            # It was a string, not an integer
            pass

        return {'values': pred["pred"], 'type': _type}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="error")


@app.post("/predict/file", tags=["ML"])
async def predict_file(file: UploadFile, trained_model: Annotated[str, Form()]):
    if file.content_type == 'text/csv':
        # convert filename
        file_name = file.filename.replace(' ', '_')

        # path and save file
        path = os.path.join(TESTS_PATH, file_name)

        with open(path, 'wb') as f:
            contents = await file.read()
            f.write(contents)

        df = pd.read_csv(path)

        df['pred'] = test_model(df, trained_model, MODEL_PATH,
                                VECTOR_PATH, SETTINGS_PATH)

        df.to_csv(path, index=False)

        return FileResponse(path)

    raise HTTPException(
        status_code=404, detail=f"{file.content_type} not allowed")


@app.post("/predict", tags=["ML"])
async def predict(body: PredictModel):
    df = pd.DataFrame(body.data)
    pred = test_model(df, body.trained_model, MODEL_PATH,
                      VECTOR_PATH, SETTINGS_PATH)

    return pred


def open_settings(file):
    # Create path to file
    settings_file = f"{file.split('.')[0]}.json"
    settings_path = os.path.join(SETTINGS_PATH, settings_file)

    # Open settings
    with open(settings_path) as f:
        settings = json.load(f)

    return settings


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", port=5000, reload=True)
    # uvicorn.run(app, host="localhost", port=5000)
