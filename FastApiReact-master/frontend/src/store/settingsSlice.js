// src/zustand/store.js
import { produce } from "immer";

import {
  getAllSettings,
  getSettings,
  saveSettings,
  setColumns,
} from "../api/settings";

// Sample Item:
// {
//   "file": "IMDB_Dataset_fa842e08-c3bb-4403-97ce-3b7d7cc00b19.csv",
//   "description": "",
//   "status": 1,
//   "target": "my_label",
//   "ouput_type": "Categorical",
//   "shift": 0,
//   "labels": [
//     "Positive",
//     "Negative"
//   ],
//   "columns": [
//     {
//       "index": 0,
//       "column": "review",
//       "type": "Text",
//       "visible": true,
//       "training": true
//     }]
// }

const initialState = {
  all_settings: [
    [
      {
        file: "",
        description: "",
        status: 0,
        target: "",
        existing: false,
        ouput_type: "",
        shift: 0,
        labels: [],
        columns: [
          {
            index: 0,
            column: "",
            type: "",
            visible: false,
            training: false,
          },
        ],
      },
    ],
  ],
  settings: {
    file: "",
    description: "",
    status: 0,
    target: "",
    existing: false,
    ouput_type: "",
    shift: 0,
    labels: [],
    columns: [],
  },
};

export const createSettingsSlice = (set, get) => ({
  ...initialState,

  // Functions
  getSetting: (file) => {
    const settings = get().all_settings;
    const idx = settings.findIndex((item) => item.file === file);
    return settings[idx];
  },

  setSettings: (payload) =>
    set(
      produce((draft) => {
        draft.settings[payload.type] = payload.value;
      })
    ),

  setSelectedColumns: (payload, index) =>
    set(
      produce((draft) => {
        draft.selectedColumns[index].checked = payload;
      })
    ),

  setTrainingColumn: (payload) =>
    set(
      produce((draft) => {
        draft.trainingColumn = payload;
      })
    ),

  // API calls
  getAllSettings: async (file) => getAllSettings(set, produce),
  getSettings: async (file) => getSettings(file, set, produce),
  setColumns: async (payload) => setColumns(payload, set, get, produce),
  saveSettings: async (payload) => saveSettings(set, get, produce),
  saveTarget: async () => {
    // add new column if not exist
    const items = get().data.data;
    const target = get().settings.target;
    const isInArray = Object.keys(items[0]).includes(target);

    if (!isInArray) {
      items.forEach((item, idx) => {
        set(
          produce((draft) => {
            draft.data.data[idx][target] = "";
          })
        );
      });

      const schema = get().data.schema.fields;

      set(
        produce((draft) => {
          draft.data.schema.fields = [
            ...schema,
            { name: target, type: "string" },
          ];
        })
      );
    }

    // otherwise save data
    saveSettings(set, get, produce);
  },
});
