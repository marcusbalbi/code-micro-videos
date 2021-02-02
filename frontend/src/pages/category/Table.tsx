import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import httpCategory from "../../util/http/http-category";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import { Category, ListResponse } from "../../util/dto";
import DefaultTable, { TableColumns } from "../../components/Table";
import { useSnackbar } from "notistack";
import { IconButton, Theme, ThemeProvider } from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { cloneDeep } from "lodash";
import { FilterResetButton } from "../../components/Table/FilterResetButton";
import reducer, { Creators, INITIAL_STATE } from "../../store/search";

const columnsDefinition: TableColumns[] = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false,
    },
  },
  {
    name: "name",
    label: "nome",
    width: "40%",
  },
  {
    name: "is_active",
    label: "Ativo?",
    width: "4%",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        if (value === true) {
          return <BadgeYes />;
        }
        return <BadgeNo />;
      },
    },
  },
  {
    name: "created_at",
    label: "Criado em",
    width: "10%",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>;
      },
    },
  },
  {
    name: "actions",
    label: "Ações",
    width: `16%`,
    options: {
      sort: false,
      customBodyRender: (value, tableMeta) => {
        return (
          <span>
            <IconButton
              color={"secondary"}
              component={Link}
              to={`categories/${tableMeta.rowData[0]}/edit`}
            >
              <EditIcon fontSize={"inherit"} />
            </IconButton>
          </span>
        );
      },
    },
  },
];

function localTheme(theme: Theme) {
  const copyTheme = cloneDeep(theme);
  const selector = `&[data-testid^="MuiDataTableBodyCell-${
    columnsDefinition.length - 1
  }"]`;
  (copyTheme.overrides as any).MUIDataTableBodyCell.root[selector] = {
    paddingTop: "0px",
    paddingBottom: "0px",
  };

  return copyTheme;
}

export const Table = () => {
  const canLoad = useRef(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const snackbar = useSnackbar();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await httpCategory.list<ListResponse<Category>>({
        queryParams: {
          search: searchState.search,
          page: searchState.pagination.page + 1,
          per_page: searchState.pagination.per_page,
          sort: searchState.order.sort,
          dir: searchState.order.dir,
        },
      });
      if (canLoad.current) {
        setCategories(data.data);
        dispatch({ type: "total", total: data.meta.total });
      }
    } catch (error) {
      console.log(error);
      if (httpCategory.isCancelledRequest(error)) {
        return;
      }
      snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [
    snackbar,
    searchState.search,
    searchState.pagination.page,
    searchState.pagination.per_page,
    searchState.order,
  ]);

  useEffect(() => {
    canLoad.current = true;
    getData();
    return () => {
      canLoad.current = false;
    };
  }, [getData]);

  return (
    <ThemeProvider theme={localTheme}>
      <DefaultTable
        debouncedSearchTime={300}
        data={categories}
        loading={loading}
        title={"Listagem de Categorias"}
        columns={columnsDefinition}
        options={{
          serverSide: true,
          searchText: searchState.search as any,
          page: searchState.pagination.page,
          rowsPerPage: searchState.pagination.per_page,
          count: searchState.pagination.total,
          customToolbar: () => {
            return (
              <FilterResetButton
                handleClick={() => {
                  dispatch(Creators.cleanFilter());
                }}
              />
            );
          },
          onSearchChange: (value) => {
            dispatch(Creators.setSearch({ search: value || "" }));
          },
          onChangePage: (page) => {
            dispatch(Creators.setPage({ page }));
          },
          onChangeRowsPerPage: (perPage) => {
            dispatch(Creators.setPerPage({ per_page: perPage }));
          },
          onColumnSortChange: (changedColumn, direction) => {
            dispatch(
              Creators.setOrder({
                sort: changedColumn,
                dir: direction.includes("desc") ? "desc" : "asc",
              })
            );
          },
        }}
      />
    </ThemeProvider>
  );
};

export default Table;
