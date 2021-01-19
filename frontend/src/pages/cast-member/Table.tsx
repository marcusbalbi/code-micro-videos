import { MUIDataTableColumn } from "mui-datatables";
import React, { useEffect, useState } from "react";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import httpCastMember from "../../util/http/http-cast-member";
import { CastMember, ListResponse } from "../../util/dto";
import DefaultTable from "../../components/Table";
const CastMemberTypeMap = {
  1: "Diretor",
  2: "Ator",
};

const columnsDefinition: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "nome",
  },
  {
    name: "type",
    label: "Tipo",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return CastMemberTypeMap[value];
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
  const [castMembers, setCastMembers] = useState<CastMember[]>([]);

  useEffect(() => {
    let canLoad = true;
    (async function getCastMembers() {
      const { data } = await httpCastMember.list<ListResponse<CastMember>>();
      if (canLoad) {
        setCastMembers(data.data);
      }
    })();
    return () => {
      canLoad = false;
    };
  }, []);

  return (
    <DefaultTable
      data={castMembers}
      title={"Listagem de Membros de Elenco"}
      columns={columnsDefinition}
    />
  );
};

export default Table;
