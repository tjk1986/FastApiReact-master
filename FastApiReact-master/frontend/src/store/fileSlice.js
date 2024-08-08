// src/zustand/store.js
import { produce } from "immer";
import {
  getFile,
  getTestFile,
  saveFile,
  deleteFile,
  uploadFile,
  getFiles,
  predict,
  testModel,
} from "../api/api";

const initialState = {
  loading: false,
  error: false,
  data: {
    schema: { fields: [], primaryKey: [], pandas_version: "" },
    data: [],
  },
  errorData: null,
  labels: [],
  files: [],
  testFiles: [],
  fileSelected: null,
  page: "workspace",
  tab: "columns",
  firstElem: 0,
  selectedColumns: [{}],
  trainingColumn: "",
  fileType: "",
  uploadModal: {
    open: false,
    fileName: "",
    file: null,
    test_size: null,
  },
  deleteModal: {
    open: false,
    fileName: "",
  },
};

export const createFileSlice = (set, get) => ({
  ...initialState,

  setFiletype: (payload) =>
    set(
      produce((draft) => {
        draft.fileType = payload;
      })
    ),

  setModalData: (payload) =>
    set(
      produce((draft) => {
        draft[payload.modal][payload.type] = payload.value;
      })
    ),

  setTab: (payload) =>
    set(
      produce((draft) => {
        draft.tab = payload;
      })
    ),

  setPage: (payload) =>
    set(
      produce((draft) => {
        draft.page = payload;
      })
    ),

  update: async (index, value) => {
    const target = get().settings.target;
    set(
      produce((draft) => {
        draft.data.data[index][target] = value;
      })
    );

    if (index - get().firstElem > 4) {
      get().predict();
    }
  },

  getFile: async (payload) => {
    get().setFiletype(payload.type);

    if (payload.type === "Train") {
      getFile(payload, set, get, produce);
      return;
    }
    getTestFile(payload, set, get, produce);
  },

  save: async () => saveFile(set, get, produce),

  delete: async (payload) => deleteFile(payload, set, get, produce),

  upload: async (payload) => uploadFile(payload, set, get, produce),

  getFiles: async () => getFiles(set, produce),

  predict: async () => predict(set, get, produce),

  testModel: async (payload) => testModel(payload, set, get, produce),
});
