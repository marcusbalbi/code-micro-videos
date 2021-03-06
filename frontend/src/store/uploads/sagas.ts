import { Types, Creators } from "./index";
import { actionChannel, take, call, put } from "redux-saga/effects";
import { AddUploadAction, FileInfo } from "./types";
import { Video } from "../../util/dto";
import httpVideo from "../../util/http/http-video";
import { END, eventChannel } from "@redux-saga/core";

export function* uploadWatcherSaga() {
  const newFilesChannel = yield actionChannel(Types.ADD_UPLOAD);

  while (true) {
    const { payload }: AddUploadAction = yield take(newFilesChannel);
    for (const fileInfo of payload.files) {
      try {
        const response = yield call(uploadFile, {
          video: payload.video,
          fileInfo: fileInfo,
        });
      } catch (err) {
        console.log(err);
      }
    }
    console.log(payload);
  }
}

function* uploadFile({
  video,
  fileInfo,
}: {
  video: Video;
  fileInfo: FileInfo;
}) {
  const channel = yield call(sendUpload, { id: video.id, fileInfo });
  while (true) {
    try {
      const { progress, response } = yield take(channel);
      if (response) {
        return response;
      }
      yield put(
        Creators.updateProgress({
          video,
          fileUpload: fileInfo.fileField,
          progress: 1
        })
      );
    } catch (err) {
      yield put(
        Creators.setUploadError({
          error: err,
          fileUpload: fileInfo.fileField,
          video,
        })
      );
      throw err;
    }
  }
}

function sendUpload({
  id,
  fileInfo,
}: {
  id: string | undefined;
  fileInfo: FileInfo;
}) {
  return eventChannel((emitter) => {
    httpVideo
      .partialUpdate(
        id,
        {
          [fileInfo.fileField]: fileInfo.file,
          _method: "PATCH",
        },
        {
          http: {
            usePost: true,
          },
          config: {
            headers: {
              ignoreLoading: true,
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
              if (progressEvent.lengthComputable) {
                const progress = progressEvent.loaded / progressEvent.total;
                emitter({ progress });
              }
            },
          },
        }
      )
      .then((response) => {
        emitter({ response });
      })
      .catch((error) => {
        emitter({error});
      })
      .finally(() => {
        emitter(END);
      });
    const unsubscribe = () => {};
    return unsubscribe;
  });
}