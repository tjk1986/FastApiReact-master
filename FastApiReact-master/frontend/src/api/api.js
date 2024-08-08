// React
import axios from "axios";

// Constants
const BASE_URL = "http://localhost:5000";

export const getFile = async (payload, set, get, produce) => {
  set(
    produce((draft) => {
      draft.loading = true;
    })
  );
  try {
    const res = await axios.get(`${BASE_URL}/file`, {
      headers: { File: payload.file, type: payload.type },
    });
    set(
      produce((draft) => {
        draft.loading = false;
        draft.data = res.data.table;
        draft.labels = getLabels(res.data.table);
        draft.fileSelected = payload.file;
        draft.selectedColumns = res.data.table.schema.fields.map((field) => {
          return { name: field.name, checked: true, training: false };
        });
        draft.trainingColumn = "";
        draft.settings = res.data.settings;
        draft.firstElem = findFirstEmpty(
          res.data.table.data,
          res.data.settings.target
        );
      })
    );
    get().setPage("settings");
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const getTestFile = async (payload, set, get, produce) => {
  set(
    produce((draft) => {
      draft.loading = true;
    })
  );
  try {
    const res = await axios.get(`${BASE_URL}/file/test`, {
      headers: { File: payload.file, type: payload.type },
    });
    set(
      produce((draft) => {
        draft.loading = false;
        draft.data = res.data;
        draft.labels = getLabels(res.data);
        draft.fileSelected = payload.file;
        draft.selectedColumns = res.data.schema.fields.map((field) => {
          return { name: field.name, checked: true, training: false };
        });
        draft.trainingColumn = "";
      })
    );
    get().setPage("test");
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const saveFile = async (set, get, produce) => {
  const curState = get();
  set({ ...curState, loading: true });
  try {
    await axios.post(`${BASE_URL}/file`, {
      curState,
    });
    set({ ...curState, success: true, loading: false });
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const deleteFile = async (payload, set, get, produce) => {
  const state = get();
  set(
    produce((draft) => {
      draft.loading = true;
    })
  );
  try {
    await axios.delete(`${BASE_URL}/file`, {
      data: { file: payload },
    });
    set({ ...state, success: true, loading: false });
    set(
      produce((draft) => {
        draft.loading = false;
        draft.deleteModal.fileName = "";
      })
    );
    get().getFiles();
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const uploadFile = async (payload, set, get, produce) => {
  const fileName = get().uploadModal.fileName;
  const test_size = get().uploadModal.test_size;
  const formData = new FormData();
  formData.append("file", payload);
  formData.append("file_name", fileName);
  formData.append("test_size", test_size);

  let uri = `${BASE_URL}/upload`;

  set(
    produce((draft) => {
      draft.loading = true;
    })
  );
  try {
    await axios.post(uri, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    set(
      produce((draft) => {
        draft.loading = false;
        draft.uploadModal.fileName = "";
        draft.uploadModal.file = null;
        draft.uploadModal.test_size = "";
      })
    );
    get().getFiles();
    get().getAllSettings();
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const getFiles = async (set, produce) => {
  set(
    produce((draft) => {
      draft.loading = true;
    })
  );
  try {
    const res = await axios.get(`${BASE_URL}/files`);

    set(
      produce((draft) => {
        draft.loading = false;
        draft.files = res.data.files;
        draft.testFiles = res.data.test_files;
      })
    );
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const predict = async (set, get, produce) => {
  const curState = get();
  const target = curState.settings.target;

  set(
    produce((draft) => {
      draft.loading = true;
      draft.firstElem = findFirstEmpty(curState.data.data, target);
    })
  );
  try {
    const res = await axios.post(`${BASE_URL}/train`, {
      curState,
    });
    // # Pred column inilization changes type to numeric, return schema
    const idx1 = curState.data.schema.fields.findIndex(
      (item) => item.name === "pred"
    );
    const idx2 = res.data.schema.findIndex((item) => item.name === "pred");
    set(
      produce((draft) => {
        res.data.values.map((value, idx) => {
          draft.data.data[idx].pred = value;
        });
        draft.success = true;
        draft.data.schema.fields[idx1] = res.data.schema[idx2];
        draft.loading = false;
      })
    );
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const testModel = async (payload, set, get, produce) => {
  const curState = get();

  set(
    produce((draft) => {
      draft.loading = true;
    })
  );

  try {
    const res = await axios.post(`${BASE_URL}/test`, {
      test_data: payload.test_data,
      trained_model: payload.trained_model,
    });

    // # Pred column inilization changes type to numeric, return schema
    const idx = curState.data.schema.fields.findIndex(
      (item) => item.name === "pred"
    );

    set(
      produce((draft) => {
        res.data.values.map((value, idx) => {
          draft.data.data[idx]["pred"] = value;
        });
        draft.success = true;
        draft.loading = false;
        draft.data.schema.fields[idx].type = res.data.type;
      })
    );
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

// Helper functions
const handleApiError = (set, produce, error) => {
  set(
    produce((draft) => {
      draft.loading = false;
      draft.error = true;
      draft.errorData = error.message;
    })
  );
};

const getLabels = (state) => {
  let labels = state.data.map(({ label }) => label);
  labels = [...new Set(labels)];
  labels = labels.filter((n) => n);
  return labels;
};

const findFirstEmpty = (rows, element) => {
  let firstElem = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][element] === null || rows[i][element] === "") {
      firstElem = i;
      break;
    }
  }
  return firstElem;
};
