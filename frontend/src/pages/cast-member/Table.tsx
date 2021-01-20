import React, { useEffect, useState } from "react";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import httpCastMember from "../../util/http/http-cast-member";
import { CastMember, ListResponse } from "../../util/dto";
import DefaultTable, { TableColumns } from "../../components/Table";
import { useSnackbar } from "notistack";
const CastMemberTypeMap = {
  1: "Diretor",
  2: "Ator",
};

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
    width: "24%",
  },
  {
    name: "type",
    label: "Tipo",
    width: "20%",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return CastMemberTypeMap[value];
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
    },
  },
];

export const Table = () => {
  const [castMembers, setCastMembers] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackbar();
  useEffect(() => {
    let canLoad = true;
    (async function getCastMembers() {
      setLoading(true);
      try {
        const { data } = await httpCastMember.list<ListResponse<CastMember>>();
        if (canLoad) {
          setCastMembers(data.data);
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
    <DefaultTable
      data={castMembers}
      loading={loading}
      title={"Listagem de Membros de Elenco"}
      columns={columnsDefinition}
    />
  );
};

export default Table;
