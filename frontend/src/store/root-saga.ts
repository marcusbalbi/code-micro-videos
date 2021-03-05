import { all } from "redux-saga/effects";
import { uploadWatcherSaga } from "./uploads/sagas";

export default function* rootSaga() {
  yield all([
    uploadWatcherSaga()
  ]);
}
