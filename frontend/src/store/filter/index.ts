import { createActions, createReducer } from "reduxsauce";
import {
  SetOrderAction,
  SetPageAction,
  SetPerPageAction,
  SetSearchAction,
  CleanFilterAction,
  State,
} from "./types";

export const { Types, Creators } = createActions<
  {
    SET_SEARCH: string;
    SET_PAGE: string;
    SET_PER_PAGE: string;
    SET_ORDER: string;
    CLEAN_FILTER: string;
  },
  {
    setSearch(payload: SetSearchAction["payload"]): SetSearchAction;
    setPage(payload: SetPageAction["payload"]): SetPageAction;
    setPerPage(payload: SetPerPageAction["payload"]): SetPerPageAction;
    setOrder(payload: SetOrderAction["payload"]): SetOrderAction;
    cleanFilter(): CleanFilterAction;
  }
>({
  setSearch: ["payload"],
  setPage: ["payload"],
  setPerPage: ["payload"],
  setOrder: ["payload"],
  cleanFilter: [],
});

export const INITIAL_STATE: State = {
  search: "",
  pagination: {
    page: 0,
    per_page: 10,
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
const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SEARCH]: setSearch,
  [Types.SET_PAGE]: setPage,
  [Types.SET_PER_PAGE]: setPerPage,
  [Types.SET_ORDER]: setOrder,
  [Types.CLEAN_FILTER]: (state = INITIAL_STATE) => {
    console.log(INITIAL_STATE.order);
    return {
      search: { value: "", update: true },
      pagination: { ...INITIAL_STATE.pagination },
      order: { ...INITIAL_STATE.order },
    };
  },
});

export default reducer;
