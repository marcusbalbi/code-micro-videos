import { createStore, applyMiddleware } from "redux";
import reducer from "./uploads";
import CreateSagaMiddleware from "redux-saga";
import rootSaga from "./root-saga";

const sagaMiddleware = CreateSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
