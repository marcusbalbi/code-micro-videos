import { createActions, createReducer } from "reduxsauce";
import {
  Actions, AddUploadAction, State
} from "./types";

export const { Types, Creators } = createActions<
  {
    ADD_UPLOAD: string;
  },
  {
    addUpload(payload: AddUploadAction["payload"]): AddUploadAction;
  }
>({
  addUpload: ["payload"],
});

export const INITIAL_STATE: State = {
  uploads: []
}

const addUpload = (state = INITIAL_STATE, action: AddUploadAction): State => {
  return {
    ...state,
  };
};

const reducer = createReducer<State, Actions>(INITIAL_STATE, {
  [Types.ADD_UPLOAD]: addUpload,
});

export default reducer;
