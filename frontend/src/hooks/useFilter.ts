import { Dispatch, Reducer, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { useDebounce } from "use-debounce";
import reducer, { Creators, INITIAL_STATE } from "../store/filter/index";
import {
  State as FilterState,
  Actions as FilterActions,
} from "../store/filter/types";
import { History } from "history";

export interface FilterManagerOptions {
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
}

export interface useFilterOptions
  extends Omit<FilterManagerOptions, "history"> {}

export class FilterManager {
  state: FilterState = null as any;
  dispatch: Dispatch<FilterActions> = null as any;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
  constructor(options: FilterManagerOptions) {
    const { rowsPerPage, rowsPerPageOptions, debounceTime, history } = options;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.debounceTime = debounceTime;
    this.history = history;
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

  pushHistory() {
    const newLocation = {
      pathname: this.history.location.pathname,
      search: "?" + new URLSearchParams(this.formatSearchParams() as any),
      state: {
        ...this.state,
        search: typeof this.state.search === "string" ? this.state.search : "",
      },
    };
    this.history.push(newLocation);
  }

  private formatSearchParams() {
    const search =
      typeof this.state.search === "string" ? this.state.search : "";
    return {
      ...(search && search !== "" && { search: search }),
      ...(this.state.pagination.per_page !== 15 && {
        per_page: this.state.pagination.per_page,
      }),
      ...(this.state.pagination.page > 0 && {
        page: this.state.pagination.page + 1,
      }),
      ...(this.state.order &&
        this.state.order.sort &&
        this.state.order.dir && {
          sort: this.state.order.sort,
          dir: this.state.order.dir,
        }),
    };
  }
}

const useFilter = (options: useFilterOptions) => {
  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterState, dispatch] = useReducer<
    Reducer<FilterState, FilterActions>
  >(reducer, INITIAL_STATE);
  const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);
  filterManager.state = filterState;
  filterManager.dispatch = dispatch as any;

  return {
    filterManager,
    filterState,
    debouncedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords,
  };
};

export default useFilter;
