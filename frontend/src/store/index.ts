import { createStore, applyMiddleware, combineReducers } from "redux";
import upload from "./uploads";
import CreateSagaMiddleware from "redux-saga";
import rootSaga from "./root-saga";

const sagaMiddleware = CreateSagaMiddleware();
const store = createStore(
  combineReducers({
    upload,
  }),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
