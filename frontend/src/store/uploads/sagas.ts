import { Types } from "./index";
import { actionChannel, take, call } from "redux-saga/effects";
import { AddUploadAction, FileInfo } from "./types";
import { Video } from "../../util/dto";
import httpVideo from "../../util/http/http-video";
import { eventChannel } from "@redux-saga/core";

export function* uploadWatcherSaga() {
  const newFilesChannel = yield actionChannel(Types.ADD_UPLOAD);

  while (true) {
    const { payload }: AddUploadAction = yield take(newFilesChannel);
    for (const fileInfo of payload.files) {
      yield call(uploadFile, { video: payload.video, fileInfo: fileInfo });
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
      const event = yield take(channel);
      console.log(event);
    } catch (err) {
      console.log(err);
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
            onUploadProgress: (progressEvent) => {
              emitter(progressEvent);
            },
          },
        }
      )
      .then((response) => {
        emitter(response);
      })
      .catch((error) => {
        emitter(error);
      });
    const unsubscribe = () => {};
    return unsubscribe;
  });
}
