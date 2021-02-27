import { createActions, createReducer } from "reduxsauce";
import { Actions, AddUploadAction, State } from "./types";

export const { Types, Creators } = createActions<
  {
    ADD_UPLOAD: string;
  },
  {
    addUpload(payload: AddUploadAction["payload"]): AddUploadAction;
  }
>({
  addUpload: ["payload"],
});

export const INITIAL_STATE: State = {
  uploads: [],
};

const addUpload = (state = INITIAL_STATE, action: AddUploadAction): State => {
  if (!action.payload.files.length) {
    return state;
  }
  const index = findIndexUpload(state, action.payload.video.id);
  if (index !== -1 && state.uploads[index].progress < 1) {
    return state;
  }
  return {
    ...state,
  };
};

const findIndexUpload = (state: State, id?: string) => {
  return state.uploads.findIndex((upload) => upload.video.id === id);
};

const reducer = createReducer<State, Actions>(INITIAL_STATE, {
  [Types.ADD_UPLOAD]: addUpload,
});

export default reducer;
