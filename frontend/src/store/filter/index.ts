import { createActions, createReducer } from "reduxsauce";
import {
  SetOrderAction,
  SetPageAction,
  SetPerPageAction,
  SetSearchAction,
  CleanFilterAction,
  updateExtraFilterAction,
  State,
  Actions,
} from "./types";

export const { Types, Creators } = createActions<
  {
    SET_SEARCH: string;
    SET_PAGE: string;
    SET_PER_PAGE: string;
    SET_ORDER: string;
    CLEAN_FILTER: string;
    UPDATE_EXTRA_FILTER: string;
  },
  {
    setSearch(payload: SetSearchAction["payload"]): SetSearchAction;
    setPage(payload: SetPageAction["payload"]): SetPageAction;
    setPerPage(payload: SetPerPageAction["payload"]): SetPerPageAction;
    setOrder(payload: SetOrderAction["payload"]): SetOrderAction;
    cleanFilter(): CleanFilterAction;
    updateExtraFilter(
      payload: updateExtraFilterAction["payload"]
    ): updateExtraFilterAction;
  }
>({
  setSearch: ["payload"],
  setPage: ["payload"],
  setPerPage: ["payload"],
  setOrder: ["payload"],
  updateExtraFilter: ["payload"],
  cleanFilter: [],
});

export const INITIAL_STATE: State = {
  search: "",
  pagination: {
    page: 0,
    per_page: 15,
  },
  order: {
    sort: null,
    dir: null,
  },
};
const setSearch = (state = INITIAL_STATE, action: SetSearchAction): State => {
  return {
    ...state,
    search: action.payload.search || "",
    pagination: {
      ...state.pagination,
      page: 0,
    },
  };
};

const setPage = (state = INITIAL_STATE, action: SetPageAction): State => {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      page: action.payload.page,
    },
  };
};

const setPerPage = (state = INITIAL_STATE, action: SetPerPageAction): State => {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      per_page: action.payload.per_page,
    },
  };
};

const setOrder = (state = INITIAL_STATE, action: SetOrderAction): State => {
  return {
    ...state,
    order: {
      sort: action.payload.sort,
      dir: action.payload.dir,
    },
  };
};

const updateExtraFilter = (
  state = INITIAL_STATE,
  action: updateExtraFilterAction
): State => {
  return {
    ...state,
    extraFilter: {
      ...state.extraFilter,
      ...action.payload,
    },
  };
};

const reducer = createReducer<State, Actions>(INITIAL_STATE, {
  [Types.SET_SEARCH]: setSearch,
  [Types.SET_PAGE]: setPage,
  [Types.SET_PER_PAGE]: setPerPage,
  [Types.SET_ORDER]: setOrder,
  [Types.UPDATE_EXTRA_FILTER]: updateExtraFilter,
  [Types.CLEAN_FILTER]: (state = INITIAL_STATE) => {
    return {
      search: { value: "", update: true },
      pagination: { ...INITIAL_STATE.pagination },
      order: { ...INITIAL_STATE.order },
    };
  },
});

export default reducer;
