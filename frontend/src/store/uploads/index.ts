import { createActions, createReducer } from "reduxsauce";
import {
  Actions,
  AddUploadAction,
  RemoveUploadAction,
  UpdateProgressAction,
  State,
} from "./types";
import update from "immutability-helper";
export const { Types, Creators } = createActions<
  {
    ADD_UPLOAD: string;
    REMOVE_UPLOAD: string;
    UPDATE_PROGRESS: string;
  },
  {
    addUpload(payload: AddUploadAction["payload"]): AddUploadAction;
    removeUpload(payload: RemoveUploadAction["payload"]): RemoveUploadAction;
    updateProgress(
      payload: UpdateProgressAction["payload"]
    ): UpdateProgressAction;
  }
>({
  addUpload: ["payload"],
  removeUpload: ["payload"],
  updateProgress: ["payload"],
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
const updateProgress = (
  state: State = INITIAL_STATE,
  action: UpdateProgressAction
): State => {
  const videoId = action.payload.video.id || "0";
  const fileField = action.payload.fileUpload;
  const { indexUpload, indexFile } = findIndexUploadAndFile(
    state,
    videoId,
    fileField
  );
  return state;
};

const findIndexUploadAndFile = (
  state: State,
  videoId: string,
  fileField: string
): { indexUpload?; indexFile? } => {
  const indexUpload = findIndexUpload(state, videoId);
  if (indexUpload === -1) {
    return {};
  }
  const upload = state.uploads[indexUpload];
  const indexFile = findIndexFile(upload.files, fileField);

  return indexFile === -1 ? {} : { indexFile, indexUpload };
};

const findIndexUpload = (state: State, id?: string) => {
  return state.uploads.findIndex((upload) => upload.video.id === id);
};

const findIndexFile = (files: Array<{ fileField }>, fileField: string) => {
  return files.findIndex((file) => file.fileField === fileField);
};

const reducer = createReducer<State, Actions>(INITIAL_STATE, {
  [Types.ADD_UPLOAD]: addUpload,
  [Types.REMOVE_UPLOAD]: removeUpload,
});

export default reducer;
