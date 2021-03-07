import { applyMiddleware, combineReducers, createStore } from "redux";
import CreateSagaMiddleware from "redux-saga";
import rootSaga from "./root-saga";
import upload from "./uploads";

const sagaMiddleware = CreateSagaMiddleware();
const store = createStore(
  combineReducers({
    upload,
  }),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
