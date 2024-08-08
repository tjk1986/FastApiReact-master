import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getAllSettings = async (set, produce) => {
  try {
    const res = await axios.get(`${BASE_URL}/settings`);
    set(
      produce((draft) => {
        draft.all_settings = res.data;
      })
    );
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const getSettings = async (file, set, produce) => {
  set(
    produce((draft) => {
      draft.loading = true;
    })
  );
  try {
    const res = await axios.get(`${BASE_URL}/setting?file=${file}`, {
      headers: { File: file },
    });
    set(
      produce((draft) => {
        draft.loading = false;
        draft.settings = res.data;
      })
    );
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const saveSettings = async (set, get, produce) => {
  set(
    produce((draft) => {
      draft.loading = true;
    })
  );
  const curState = get().settings;
  try {
    await axios.post(`${BASE_URL}/setting`, curState);
    set(
      produce((draft) => {
        draft.loading = false;
      })
    );
  } catch (err) {
    handleApiError(set, produce, err);
  }
};

export const setColumns = async (payload, set, get, produce) => {
  set(
    produce((draft) => {
      draft.loading = true;
      draft.settings.columns[payload.index][payload.type] = payload.value;
    })
  );
  const curState = get().settings;
  try {
    await axios.post(`${BASE_URL}/setting`, curState);
    set(
      produce((draft) => {
        draft.loading = false;
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
