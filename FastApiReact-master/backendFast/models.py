from pydantic import BaseModel


class TestModel(BaseModel):
    trained_model: str
    test_data: str


class PredictModel(BaseModel):
    trained_model: str
    data: list = []


# Settings
class ColumnModel(BaseModel):
    index: int
    column: str
    type: str
    visible: bool = True
    training: bool = False


class SettingsModel(BaseModel):
    file: str
    description: str
    status: int = 0
    target: str
    existing: bool = False
    ouput_type: str
    model: str
    shift: int = 0
    labels: list = []
    columns: list[ColumnModel] = []
