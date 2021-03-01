import { createActions, createReducer } from "reduxsauce";
import { Actions, AddUploadAction, RemoveUploadAction, State } from "./types";
import update from "immutability-helper";
export const { Types, Creators } = createActions<
  {
    ADD_UPLOAD: string;
    REMOVE_UPLOAD: string;
  },
  {
    addUpload(payload: AddUploadAction["payload"]): AddUploadAction;
    removeUpload(payload: RemoveUploadAction["payload"]): RemoveUploadAction;
  }
>({
  addUpload: ["payload"],
  removeUpload: ["payload"],
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

  const uploads =
    index === -1
      ? state.uploads
      : update(state.uploads, { $splice: [[index, 1]] });

  return {
    uploads: [
      ...uploads,
      {
        video: action.payload.video,
        files: action.payload.files.map((file) => {
          return {
            fileField: file.fileField,
            filename: file.file.name,
            progress: 0,
          };
        }),
        progress: 0,
      },
    ],
  };
};

const removeUpload = (
  state: State = INITIAL_STATE,
  action: RemoveUploadAction
): State => {
  const uploads = state.uploads.filter((item) => {
    return item.video.id !== action.payload.id;
  });
  if (uploads.length === state.uploads.length) {
    return state;
  }
  return {
    uploads,
  };
};

const findIndexUpload = (state: State, id?: string) => {
  return state.uploads.findIndex((upload) => upload.video.id === id);
};

const reducer = createReducer<State, Actions>(INITIAL_STATE, {
  [Types.ADD_UPLOAD]: addUpload,
  [Types.REMOVE_UPLOAD]: removeUpload,
});

export default reducer;
