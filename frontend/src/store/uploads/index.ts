import { createActions, createReducer } from "reduxsauce";
import {
  Actions,
  AddUploadAction,
  RemoveUploadAction,
  UpdateProgressAction,
  UploadState,
  SetUploadErrorAction,
} from "./types";
import update from "immutability-helper";
export const { Types, Creators } = createActions<
  {
    ADD_UPLOAD: string;
    REMOVE_UPLOAD: string;
    UPDATE_PROGRESS: string;
    SET_UPLOAD_ERROR: string;
  },
  {
    addUpload(payload: AddUploadAction["payload"]): AddUploadAction;
    removeUpload(payload: RemoveUploadAction["payload"]): RemoveUploadAction;
    updateProgress(
      payload: UpdateProgressAction["payload"]
    ): UpdateProgressAction;
    setUploadError(
      payload: SetUploadErrorAction["payload"]
    ): SetUploadErrorAction;
  }
>({
  addUpload: ["payload"],
  removeUpload: ["payload"],
  updateProgress: ["payload"],
  setUploadError: ["payload"],
});

export const INITIAL_STATE: UploadState = {
  uploads: [],
};

const addUpload = (
  state = INITIAL_STATE,
  action: AddUploadAction
): UploadState => {
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
  console.log(
    action.payload.files.map((file) => {
      return {
        fileField: file.fileField,
        filename: file.file.name,
        progress: 0,
      };
    })
  );
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
  state: UploadState = INITIAL_STATE,
  action: RemoveUploadAction
): UploadState => {
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
  state: UploadState = INITIAL_STATE,
  action: UpdateProgressAction
): UploadState => {
  const videoId = action.payload.video.id || "0";
  const fileField = action.payload.fileUpload;
  const { indexUpload, indexFile } = findIndexUploadAndFile(
    state,
    videoId,
    fileField
  );
  if (typeof indexUpload === "undefined") {
    return state;
  }
  const upload = state.uploads[indexUpload];
  const file = upload.files[indexFile];

  if (file.progress === action.payload.progress) {
    return state;
  }
  console.log(state.uploads, indexUpload, "=============================");
  const uploads = update(state.uploads, {
    [indexUpload]: {
      $apply(upload) {
        const files = update(upload.files, {
          [indexFile]: {
            $set: { ...file, progress: action.upload.progress },
          },
        });
        const progress = calculateGlobalProgress(files);
        return {
          ...upload,
          progress,
          files,
        };
      },
    },
  });
  return {
    uploads,
  };
};

const setUploadError = (
  state: UploadState = INITIAL_STATE,
  action: SetUploadErrorAction
): UploadState => {
  const videoId = action.payload.video.id || "0";
  const fileField = action.payload.fileUpload;
  const { indexUpload, indexFile } = findIndexUploadAndFile(
    state,
    videoId,
    fileField
  );
  if (typeof indexUpload === "undefined") {
    return state;
  }
  const upload = state.uploads[indexUpload];
  const file = upload.files[indexFile];

  const uploads = update(state.uploads, {
    [indexUpload]: {
      files: {
        [indexFile]: {
          $set: { ...file, error: action.payload.error, progress: 1 },
        },
      },
    },
  });
  return {
    uploads,
  };
};

const findIndexUploadAndFile = (
  state: UploadState,
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

const calculateGlobalProgress = (files: Array<{ progress }>) => {
  const countFiles = files.length;
  if (!countFiles) {
    return 0;
  }
  const sumProgress = files.reduce((sum, file) => {
    return sum + file.progress;
  }, 0);

  return sumProgress / countFiles;
};

const findIndexUpload = (state: UploadState, id?: string) => {
  return state.uploads.findIndex((upload) => upload.video.id === id);
};

const findIndexFile = (files: Array<{ fileField }>, fileField: string) => {
  return files.findIndex((file) => file.fileField === fileField);
};

const reducer = createReducer<UploadState, Actions>(INITIAL_STATE, {
  [Types.ADD_UPLOAD]: addUpload,
  [Types.REMOVE_UPLOAD]: removeUpload,
  [Types.UPDATE_PROGRESS]: updateProgress,
  [Types.SET_UPLOAD_ERROR]: setUploadError,
});

export default reducer;
