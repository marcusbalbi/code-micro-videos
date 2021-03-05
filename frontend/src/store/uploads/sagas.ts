import { Types } from "./index";
import { actionChannel, take, call } from "redux-saga/effects";
import { AddUploadAction, FileInfo } from "./types";
import { Video } from "../../util/dto";
import httpVideo from "../../util/http/http-video";
import { number } from "yup/lib/locale";

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
  yield call(sendUpload, { id: video.id, fileInfo });
}

function* sendUpload({
  id,
  fileInfo,
}: {
  id: string | undefined;
  fileInfo: FileInfo;
}) {
  httpVideo.update(
    id,
    {
      [fileInfo.fileField]: fileInfo.file,
    },
    {
      config: {
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent);
        },
      },
    }
  );
}
