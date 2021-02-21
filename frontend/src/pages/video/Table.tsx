import React, { useCallback, useEffect, useRef, useState } from "react";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import httpVideo from "../../util/http/http-video";
import { Video, ListResponse } from "../../util/dto";
import DefaultTable, { TableColumns } from "../../components/Table";
import { useSnackbar } from "notistack";
import { IconButton, Theme, ThemeProvider } from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { cloneDeep } from "lodash";
import { FilterResetButton } from "../../components/Table/FilterResetButton";
import useFilter from "../../hooks/useFilter";

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
    name: "title",
    label: "Titulo",
    width: "20%",
    options: {
      filter: false,
    },
  },
  {
    name: "genres",
    label: "Gêneros",
    width: "13%",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.map((v) => v.name).join(", ");
      },
    },
  },
  {
    name: "categories",
    label: "Categorias",
    width: "12%",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.map((v) => v.name).join(", ");
      },
    },
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
              to={`videos/${tableMeta.rowData[0]}/edit`}
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const { data } = await httpVideo.list<ListResponse<Video>>({
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
        setVideos(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch (error) {
      console.log(error);
      if (httpVideo.isCancelledRequest(error)) {
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
        data={videos}
        loading={loading}
        title={"Listagem de Videos"}
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
