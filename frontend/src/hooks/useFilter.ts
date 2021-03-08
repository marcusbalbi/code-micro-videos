import {
  Dispatch,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  Actions as FilterActions,
  State as FilterState,
} from "../store/filter/types";
import reducer, { Creators } from "../store/filter/index";
import { useHistory, useLocation } from "react-router";
import { History } from "history";
import { MUIDataTableColumn } from "mui-datatables";
import { isEqual } from "lodash";
import { useDebounce } from "use-debounce";
import yup from "../util/vendor/yup";
export interface FilterManagerOptions {
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
  columns: MUIDataTableColumn[];
  extraFilter?: ExtraFilter;
  schema: any;
}

export interface ExtraFilter {
  getStateFromURL: (queryParams: URLSearchParams) => any;
  formatSearchParams: (debouncedState: FilterState) => any;
  createValidationSchema: () => any;
}

export interface useFilterOptions
  extends Omit<FilterManagerOptions, "history" | "schema"> {}

export class FilterManager {
  schema;
  state: FilterState = null as any;
  debouncedFilterState: FilterState = null as any;
  dispatch: Dispatch<FilterActions> = null as any;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
  columns: MUIDataTableColumn[];
  extraFilter?: ExtraFilter;
  constructor(options: FilterManagerOptions) {
    const {
      rowsPerPage,
      rowsPerPageOptions,
      debounceTime,
      history,
      columns,
      extraFilter,
      schema,
    } = options;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.debounceTime = debounceTime;
    this.history = history;
    this.columns = columns;
    this.extraFilter = extraFilter ? extraFilter : undefined;
    this.schema = schema;
  }

  private resetTablePagination() {
    this.changePage(0);
    this.changeRowsPerPage(this.rowsPerPage);
  }

  changeSearch(value) {
    this.dispatch(Creators.setSearch({ search: value || null }));
    this.resetTablePagination();
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
    this.resetTablePagination();
  }

  cleanFilter() {
    this.dispatch(Creators.cleanFilter());
    this.resetTablePagination();
  }

  getCorrectPage() {
    // MUIDataTable Count page with 0, pass to prop with -1
    const page = this.debouncedFilterState.pagination.page;

    return page <= 0 ? page : page - 1;
  }

  changeExtraFilter(data) {
    this.dispatch(Creators.updateExtraFilter(data));
  }
}
let i = 0;
const useFilter = (options: useFilterOptions) => {
  i++;
  console.log(i);
  const history = useHistory();
  const location = useLocation();
  const { pathname: pathnameLocation, search: searchLocation, state: stateLocation } = location;
  const { columns, rowsPerPage, extraFilter } = options;
  const schema = useMemo(() => {
    return yup.object().shape({
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
          .transform((value) => (isNaN(value) ? undefined : value))
          .default(rowsPerPage),
      }),
      order: yup.object().shape({
        sort: yup
          .string()
          .nullable()
          .transform((value) => {
            const columnsName = columns
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
      ...(extraFilter && {
        extraFilter: extraFilter.createValidationSchema(),
      }),
    });
  }, [extraFilter, columns, rowsPerPage]);
  const filterManager = new FilterManager({ ...options, history, schema });
  const stateFromURL = useMemo(() => {
    const queryParams = new URLSearchParams(searchLocation.substr(1));
    return schema.cast({
      search: queryParams.get("search"),
      pagination: {
        page: queryParams.get("page"),
        per_page: queryParams.get("per_page"),
      },
      order: {
        sort: queryParams.get("sort"),
        dir: queryParams.get("dir"),
      },
      ...(extraFilter && {
        extraFilter: extraFilter.getStateFromURL(queryParams),
      }),
    });
  }, [extraFilter, schema, searchLocation]);
  const INITIAL_STATE = stateFromURL;
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterState, dispatch] = useReducer<
    Reducer<FilterState, FilterActions>
  >(reducer, INITIAL_STATE);

  const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);
  filterManager.state = filterState;
  filterManager.debouncedFilterState = debouncedFilterState;
  filterManager.dispatch = dispatch as any;

  const formatSearchParams = useCallback((state, extraFilter) => {
    const search = typeof state.search === "string" ? state.search : "";
    return {
      ...(search && search !== "" && { search: search }),
      ...(state.pagination.per_page !== 15 && {
        per_page: state.pagination.per_page,
      }),
      ...(state.pagination.page > 1 && {
        page: state.pagination.page,
      }),
      ...(state.order &&
        state.order.sort &&
        state.order.dir && {
          sort: state.order.sort,
          dir: state.order.dir,
        }),
      ...(extraFilter && extraFilter.formatSearchParams(state)),
    };
  }, []);

  useEffect(() => {
    history.replace({
      pathname: pathnameLocation,
      search:
        "?" +
        new URLSearchParams(
          formatSearchParams(stateFromURL, extraFilter) as any
        ),
      state: stateFromURL,
    });
  }, [
    history,
    pathnameLocation,
    stateFromURL,
    extraFilter,
    formatSearchParams,
  ]);

  useEffect(() => {
    const newLocation = {
      pathname: pathnameLocation,
      search:
        "?" +
        new URLSearchParams(
          formatSearchParams(stateFromURL, extraFilter) as any
        ),
      state: {
        ...stateFromURL,
        search:
          typeof debouncedFilterState.search === "string"
            ? debouncedFilterState.search
            : "",
      },
    };
    const oldState = stateLocation;
    const nextState = debouncedFilterState;
    if (!isEqual(oldState, nextState)) {
      history.push(newLocation);
    }
  }, [
    debouncedFilterState,
    extraFilter,
    stateLocation,
    formatSearchParams,
    history,
    pathnameLocation,
    stateFromURL,
  ]);

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
