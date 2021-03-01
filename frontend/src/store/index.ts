import { createStore } from "redux";
import reducer from "./uploads";

const store = createStore(
  reducer
)

export default store;