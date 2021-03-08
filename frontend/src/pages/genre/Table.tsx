import { BadgeNo, BadgeYes } from "../../components/Badge";
import DefaultTable, { TableColumns } from "../../components/Table";
import { Genre, ListResponse } from "../../util/dto";
import { IconButton, Theme, ThemeProvider } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";

import EditIcon from "@material-ui/icons/Edit";
import { FilterResetButton } from "../../components/Table/FilterResetButton";
import { Link } from "react-router-dom";
import LoadingContext from "../../components/loading/LoadingContext";
import { cloneDeep } from "lodash";
import format from "date-fns/format";
import httpCategory from "../../util/http/http-category";
import httpGenre from "../../util/http/http-genre";
import parseISO from "date-fns/parseISO";
import useFilter from "../../hooks/useFilter";
import { useSnackbar } from "notistack";
import yup from "../../util/vendor/yup";

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
    width: "30%",
    options: {
      filter: false,
    },
  },
  {
    name: "categories",
    label: "Categorias",
    width: "30%",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        if (value && value.length) {
          return value.map((value: any) => value.name).join(", ");
        }
        return ""
      },
      filterType: "multiselect",
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "is_active",
    label: "Ativo?",
    width: "4%",
    options: {
      // filterOptions: {
      //   names: ["SIM", "NÃO"],
      // },
      filter: false,
      // customFilterListOptions: {
      //   render: (v) => {
      //     if (v === true) {
      //       return ["ativo: SIM"];
      //     } else if (v === false) {
      //       return ["ativo: NÃO"];
      //     }
      //     return [];
      //   },
      // },
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
      filter: false,
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
              to={`genres/${tableMeta.rowData[0]}/edit`}
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
  const [genres, setGenres] = useState<Genre[]>([]);
  // const [_cat, setCategories] = useState<Category[]>([]);
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
    extraFilter: {
      createValidationSchema: () => {
        return yup.object().shape({
          categories: yup
            .mixed()
            .nullable()
            .transform((value) => {
              return !value || value === "" ? undefined : value.split(",");
            })
            .default(null),
        });
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter &&
                debouncedState.extraFilter.categories && {
                  categories: debouncedState.extraFilter.categories.join(","),
                }),
            }
          : undefined;
      },
      getStateFromURL: (queryParams) => {
        return {
          categories: queryParams.get("categories"),
        };
      },
    },
  });
  const snackbar = useSnackbar();

  const getData = useCallback(async () => {
    try {
      const { data } = await httpGenre.list<ListResponse<Genre>>({
        queryParams: {
          search:
            typeof debouncedFilterState.search === "string"
              ? debouncedFilterState.search
              : "",
          withCategories: true,
          page: debouncedFilterState.pagination.page,
          per_page: debouncedFilterState.pagination.per_page,
          sort: debouncedFilterState.order.sort,
          dir: debouncedFilterState.order.dir,
          ...(debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.categories && {
              categories: debouncedFilterState.extraFilter.categories.join(","),
            }),
        },
      });
      if (canLoad.current) {
        setGenres(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch (error) {
      console.log(error);
      if (httpGenre.isCancelledRequest(error)) {
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
    debouncedFilterState.extraFilter,
  ]);

  useEffect(() => {
    // filterManager.replaceHistory();
    //eslint-disable-next-line
  }, []);

  const columnCategory = columnsDefinition.find((c) => c.name === "categories");
  const categoriesFilterValue =
    filterState.extraFilter && filterState.extraFilter.categories;
  if (columnCategory && columnCategory.options) {
    columnCategory.options.filterList = categoriesFilterValue
      ? [...categoriesFilterValue]
      : [];
  }
  useEffect(() => {
    let canLoad = true;
    (async () => {
      try {
        const { data } = await httpCategory.list({ queryParams: { all: "" } });
        if (
          canLoad &&
          columnCategory &&
          columnCategory.options &&
          columnCategory.options.filterOptions
        ) {
          // setCategories(data.data);
          columnCategory.options.filterOptions.names = data.data.map(
            (category) => category.name
          );
        }
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
          variant: "error",
        });
      }
    })();
    return () => {
      canLoad = false;
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    canLoad.current = true;
    getData();
    // filterManager.pushHistory();
    return () => {
      canLoad.current = false;
    };
    //eslint-disable-next-line
  }, [getData]);

  return (
    <ThemeProvider theme={localTheme}>
      <DefaultTable
        debouncedSearchTime={debounceTimeSearchText}
        data={genres}
        loading={loading}
        title={"Listagem de Generos"}
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
          onFilterChange: (changedColumn, filterList, type, index) => {
            filterManager.changeExtraFilter({
              [changedColumn as string]: filterList[index].length
                ? filterList[index]
                : null,
            });
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
