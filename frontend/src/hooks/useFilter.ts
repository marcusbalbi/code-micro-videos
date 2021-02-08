import { Dispatch, Reducer, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { useDebounce } from "use-debounce";
import reducer, { Creators } from "../store/filter/index";
import { MUIDataTableColumn } from "mui-datatables";
import {
  State as FilterState,
  Actions as FilterActions,
} from "../store/filter/types";
import { History } from "history";
import { isEqual } from "lodash";
import yup from "../util/vendor/yup";
export interface FilterManagerOptions {
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
  columns: MUIDataTableColumn[];
  tableRef: React.MutableRefObject<MuiDatatableRefComponent>;
  extraFilter?: ExtraFilter;
}

export interface ExtraFilter {
  getStateFromURL: (queryParams: URLSearchParams) => any;
  formatSearchParams: (debouncedState: FilterState) => any;
  createValidationSchema: () => any;
}

export interface useFilterOptions
  extends Omit<FilterManagerOptions, "history"> {}

export class FilterManager {
  schema;
  state: FilterState = null as any;
  dispatch: Dispatch<FilterActions> = null as any;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
  columns: MUIDataTableColumn[];
  tableRef: React.MutableRefObject<MuiDatatableRefComponent>;
  extraFilter?: ExtraFilter;
  constructor(options: FilterManagerOptions) {
    const {
      rowsPerPage,
      rowsPerPageOptions,
      debounceTime,
      history,
      columns,
      extraFilter,
      tableRef,
    } = options;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.debounceTime = debounceTime;
    this.history = history;
    this.columns = columns;
    this.tableRef = tableRef;
    this.extraFilter = extraFilter ? extraFilter : undefined;
    this.createValidationSchema();
  }

  changeSearch(value) {
    this.dispatch(Creators.setSearch({ search: value || null }));
  }

  changePage(page) {
    // MUIDataTable Count page with 0
    this.dispatch(Creators.setPage({ page: page + 1 }));
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

  getCorrectPage() {
    // MUIDataTable Count page with 0, pass to prop with -1
    return this.state.pagination.page - 1;
  }

  replaceHistory() {
    this.history.replace({
      pathname: this.history.location.pathname,
      search: "?" + new URLSearchParams(this.formatSearchParams() as any),
      state: this.state,
    });
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
    const oldState = this.history.location.state;
    const nextState = this.state;
    if (!isEqual(oldState, nextState)) {
      this.history.push(newLocation);
    }
  }

  private formatSearchParams() {
    const search =
      typeof this.state.search === "string" ? this.state.search : "";
    return {
      ...(search && search !== "" && { search: search }),
      ...(this.state.pagination.per_page !== 15 && {
        per_page: this.state.pagination.per_page,
      }),
      ...(this.state.pagination.page > 1 && {
        page: this.state.pagination.page,
      }),
      ...(this.state.order &&
        this.state.order.sort &&
        this.state.order.dir && {
          sort: this.state.order.sort,
          dir: this.state.order.dir,
        }),
      ...(this.extraFilter && this.extraFilter.formatSearchParams(this.state)),
    };
  }

  getStateFromURL() {
    const queryParams = new URLSearchParams(
      this.history.location.search.substr(1)
    );
    return this.schema.cast({
      search: queryParams.get("search"),
      pagination: {
        page: queryParams.get("page"),
        per_page: queryParams.get("per_page"),
      },
      order: {
        sort: queryParams.get("sort"),
        dir: queryParams.get("dir"),
      },
      ...(this.extraFilter && {
        extraFilter: this.extraFilter.getStateFromURL(queryParams),
      }),
    });
  }

  private createValidationSchema() {
    this.schema = yup.object().shape({
      search: yup
        .string()
        .transform((value) => (!value ? undefined : value))
        .default(""),
      pagination: yup.object().shape({
        page: yup
          .number()
          .transform((value) =>
            isNaN(value) || parseInt(value) < 1 ? undefined : value
          )
          .default(1),
        per_page: yup
          .number()
          .oneOf(this.rowsPerPageOptions)
          .transform((value) => (isNaN(value) ? undefined : value))
          .default(this.rowsPerPage),
      }),
      order: yup.object().shape({
        sort: yup
          .string()
          .nullable()
          .transform((value) => {
            const columnsName = this.columns
              .filter((column) => {
                return !column.options || column.options.sort !== false;
              })
              .map((column) => column.name);
            return columnsName.includes(value) ? value : undefined;
          })
          .default(null),
        dir: yup
          .string()
          .nullable()
          .transform((value) => {
            return !value || ["asc", "desc"].includes(value.toLowerCase())
              ? value
              : undefined;
          })
          .default(null),
      }),
      ...(this.extraFilter && {
        extraFilter: this.extraFilter.createValidationSchema(),
      }),
    });
  }
}

const useFilter = (options: useFilterOptions) => {
  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });
  const INITIAL_STATE = filterManager.getStateFromURL();
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
