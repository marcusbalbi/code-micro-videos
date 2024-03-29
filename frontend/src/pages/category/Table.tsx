import { BadgeNo, BadgeYes } from "../../components/Badge";
import { Category, ListResponse } from "../../util/dto";
import DefaultTable, { TableColumns } from "../../components/Table";
import { IconButton, Theme, ThemeProvider } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";

import EditIcon from "@material-ui/icons/Edit";
import { FilterResetButton } from "../../components/Table/FilterResetButton";
import { Link } from "react-router-dom";
import LoadingContext from "../../components/loading/LoadingContext";
import { cloneDeep } from "lodash";
import format from "date-fns/format";
import httpCategory from "../../util/http/http-category";
import parseISO from "date-fns/parseISO";
import useFilter from "../../hooks/useFilter";
import { useSnackbar } from "notistack";
import { useKeycloak } from "@react-keycloak/web";

const debounceTime = 300;
const debounceTimeSearchText = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
const columnsDefinition: TableColumns[] = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: "name",
    label: "nome",
    width: "40%",
    options: {
      filter: false,
    },
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
      // filterOptions: {
      //   names: ["SIM", "NÃO"]
      // },
      // customFilterListOptions: {
      //   render: v => {
      //     if (v === true) {
      //       return ["ativo: SIM"];
      //     } else if (v === false) {
      //       return ["ativo: NÃO"];
      //     }
      //     return[]
      //   },
      // },
    }
  },
  {
    name: "created_at",
    label: "Criado em",
    width: "10%",
    options: {
      filter: false,
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
      filter: false,
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
  const keycloak = useKeycloak();
  console.log(keycloak)
  const canLoad = useRef(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const loading = useContext(LoadingContext);
  const {
    filterState,
    debouncedFilterState,
    totalRecords,
    setTotalRecords,
    filterManager,
  } = useFilter({
    debounceTime: debounceTime,
    rowsPerPage: rowsPerPage,
    columns: columnsDefinition,
    rowsPerPageOptions: rowsPerPageOptions,
  });
  const snackbar = useSnackbar();

  const getData = useCallback(async () => {
    try {
      const { data } = await httpCategory.list<ListResponse<Category>>({
        queryParams: {
          search:
            typeof debouncedFilterState.search === "string"
              ? debouncedFilterState.search
              : "",
          page: debouncedFilterState.pagination.page,
          per_page: debouncedFilterState.pagination.per_page,
          sort: debouncedFilterState.order.sort,
          dir: debouncedFilterState.order.dir,
        },
      });
      if (canLoad.current) {
        setCategories(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch (error) {
      console.log(error);
      if (httpCategory.isCancelledRequest(error)) {
        return;
      }
      snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
        variant: "error",
      });
    }
  }, [
    snackbar,
    debouncedFilterState.search,
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order,
    setTotalRecords,
  ]);

  useEffect(() => {
    filterManager.replaceHistory();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    canLoad.current = true;
    getData();
    filterManager.pushHistory();
    return () => {
      canLoad.current = false;
    };
    //eslint-disable-next-line
  }, [getData]);

  return (
    <ThemeProvider theme={localTheme}>
      <DefaultTable
        debouncedSearchTime={debounceTimeSearchText}
        data={categories}
        loading={loading}
        title={"Listagem de Categorias"}
        columns={columnsDefinition}
        options={{
          serverSide: true,
          searchText: filterState.search as any,
          page: filterManager.getCorrectPage(),
          rowsPerPage: filterState.pagination.per_page,
          rowsPerPageOptions,
          count: totalRecords,
          sortOrder: {
            name: filterState.order.sort || "NONE",
            direction: (filterState.order.dir as any) || "asc",
          },
          customToolbar: () => {
            return (
              <FilterResetButton
                handleClick={() => {
                  filterManager.cleanFilter();
                }}
              />
            );
          },
          onSearchChange: (value) => {
            filterManager.changeSearch(value);
          },
          onChangePage: (page) => {
            filterManager.changePage(page);
          },
          onChangeRowsPerPage: (perPage) => {
            filterManager.changeRowsPerPage(perPage);
          },
          onColumnSortChange: (changedColumn, direction) => {
            filterManager.columnSortChange(changedColumn, direction);
          },
        }}
      />
    </ThemeProvider>
  );
};

export default Table;
