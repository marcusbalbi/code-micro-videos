import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import React, { useEffect, useState } from "react";
import httpGenre from "../../util/http/http-genre";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { BadgeNo, BadgeYes } from "../../components/Badge";

const columnsDefinition: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "nome",
  },
  {
    name: "categories",
    label: "Categorias",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.map((value: any) => value.name).join(", ");
      },
    },
  },
  {
    name: "is_active",
    label: "Ativo?",
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
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>;
      },
    },
  },
];

export const Table = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    let canLoad = true;
    (async function getGenres() {
      const { data } = await httpGenre.list<{ data }>();
      if (canLoad) {
        setGenres(data.data);
      }
    })();
    return () => {
      canLoad = false;
    };
  }, []);

  return (
    <MUIDataTable
      data={genres}
      title={"Listagem de Generos"}
      columns={columnsDefinition}
    />
  );
};

export default Table;
