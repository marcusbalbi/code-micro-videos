import { useReducer, useState } from "react";
import reducer, { Creators, INITIAL_STATE } from "../store/filter/index";

const useFilter = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE);

  return {
    filterState,
    dispatch,
    totalRecords,
    setTotalRecords,
  };
};

export default useFilter;
