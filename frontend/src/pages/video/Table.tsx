import DefaultTable, { TableColumns } from "../../components/Table";
import { IconButton, Theme, ThemeProvider } from "@material-ui/core";
import { ListResponse, Video } from "../../util/dto";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import DeleteDialog from "../../components/DeleteDialog";
import EditIcon from "@material-ui/icons/Edit";
import { FilterResetButton } from "../../components/Table/FilterResetButton";
import { Link } from "react-router-dom";
import LoadingContext from "../../components/loading/LoadingContext";
import { cloneDeep } from "lodash";
import format from "date-fns/format";
import httpVideo from "../../util/http/http-video";
import parseISO from "date-fns/parseISO";

import useDeleteCollection from "../../hooks/useDeleteCollection";
import useFilter from "../../hooks/useFilter";
import { useSnackbar } from "notistack";

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
  const loading = useContext(LoadingContext);
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete,
  } = useDeleteCollection();
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

  function deleteRows(confirmed) {
    console.log("conformed ?", confirmed);
    if (!confirmed) {
      setOpenDeleteDialog(false);
      return;
    }
    const ids = rowsToDelete.data
      .map((value) => {
        return videos[value.index].id;
      })
      .join(",");

    httpVideo
      .deleteCollection({ ids })
      .then((response) => {
        snackbar.enqueueSnackbar("Registros excluidos com sucesso!", {
          variant: "success",
        });
        if (
          rowsToDelete.data.length === filterState.pagination.per_page &&
          filterState.pagination.page > 1
        ) {
          const page = filterState.pagination.page - 2;
          filterManager.changePage(page);
        } else {
          return getData();
        }
      })
      .catch((err) => {
        console.log(err);
        snackbar.enqueueSnackbar("Não foi possivel excluir os registros", {
          variant: "error",
        });
      })
      .finally(() => {
        setOpenDeleteDialog(false);
      });
  }

  return (
    <ThemeProvider theme={localTheme}>
      <DeleteDialog open={openDeleteDialog} handleClose={deleteRows} />
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
          onRowsDelete: (rowsDeleted) => {
            console.log(rowsDeleted);
            setRowsToDelete(rowsDeleted as any);
            return false;
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
