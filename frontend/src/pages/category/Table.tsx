import React, { useCallback, useEffect, useRef, useState } from "react";

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
import useFilter from "../../hooks/useFilter";

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
  const {
    filterState,
    totalRecords,
    setTotalRecords,
    filterManager,
  } = useFilter({
    debounceTime: 300,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 50],
  });
  const snackbar = useSnackbar();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await httpCategory.list<ListResponse<Category>>({
        queryParams: {
          search:
            typeof filterState.search === "string" ? filterState.search : "",
          page: filterState.pagination.page + 1,
          per_page: filterState.pagination.per_page,
          sort: filterState.order.sort,
          dir: filterState.order.dir,
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
    } finally {
      setLoading(false);
    }
  }, [
    snackbar,
    filterState.search,
    filterState.pagination.page,
    filterState.pagination.per_page,
    filterState.order,
    setTotalRecords,
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
          searchText: filterState.search as any,
          page: filterState.pagination.page,
          rowsPerPage: filterState.pagination.per_page,
          count: totalRecords,
          sortOrder: {
            name: filterState.order.sort || "NONE",
            direction: filterState.order.dir as any || "asc",
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
