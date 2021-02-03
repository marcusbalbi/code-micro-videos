import { Dispatch, Reducer, useReducer, useState } from "react";
import reducer, { Creators, INITIAL_STATE } from "../store/filter/index";
import {
  State as FilterState,
  Actions as FilterActions,
} from "../store/filter/types";

export interface FilterManagerOptions {
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
}

export class FilterManager {
  state: FilterState = null as any;
  dispatch: Dispatch<FilterActions> = null as any;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;

  constructor(options: FilterManagerOptions) {
    const { rowsPerPage, rowsPerPageOptions, debounceTime } = options;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.debounceTime = debounceTime;
  }

  changeSearch(value) {
    this.dispatch(Creators.setSearch({ search: value || null }));
  }

  changePage(page) {
    this.dispatch(Creators.setPage({ page }));
  }

  changeRowsPerPage(perPage) {
    this.dispatch(Creators.setPerPage({ per_page: perPage }));
  }

  columnSortChange(changedColumn, direction) {
    this.dispatch(
      Creators.setOrder({
        sort: changedColumn,
        dir: direction.includes("desc") ? "desc" : "asc",
      })
    );
  }

  cleanFilter() {
    this.dispatch(Creators.cleanFilter());
  }
}

const useFilter = (options: FilterManagerOptions) => {
  const filterManager = new FilterManager(options);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterState, dispatch] = useReducer<
    Reducer<FilterState, FilterActions>
  >(reducer, INITIAL_STATE);
  filterManager.state = filterState;
  filterManager.dispatch = dispatch as any;

  return {
    filterManager,
    filterState,
    dispatch,
    totalRecords,
    setTotalRecords,
  };
};

export default useFilter;
