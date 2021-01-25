import React, { useEffect, useState } from "react";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackbar();

  useEffect(() => {
    let canLoad = true;
    (async function getCagegories() {
      setLoading(true);
      try {
        const { data } = await httpCategory.list<ListResponse<Category>>();
        if (canLoad) {
          setCategories(data.data);
        }
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      canLoad = false;
    };
  }, [snackbar]);

  return (
    <ThemeProvider theme={localTheme} >
      <DefaultTable
        data={categories}
        loading={loading}
        title={"Listagem de Categorias"}
        columns={columnsDefinition}
      />
    </ThemeProvider>
  );
};

export default Table;
