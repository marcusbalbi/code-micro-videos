import React, { useMemo, useState } from "react";
import LoadingContext from "./LoadingContext";
import {
  addGlobalRequestInterceptor,
  addGlobalResponseInterceptor,
  removeGlobalResponseInterceptor,
  removeGlobalRequestInterceptor,
} from "../../util/http";

const LoadingProvider = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  useMemo(() => {
    let isSubscribed = true;
    const requestIds = addGlobalRequestInterceptor((config) => {
      if (isSubscribed) {
        setLoading(true);
      }
      return config;
    });
    const responseIds = addGlobalResponseInterceptor(
      (response) => {
        if (isSubscribed) {
          setLoading(false);
        }
        return response;
      },
      (error) => {
        setLoading(false);
        removeGlobalRequestInterceptor(requestIds);
        removeGlobalResponseInterceptor(responseIds);
        return Promise.reject(error);
      }
    );
    return () => {
      isSubscribed = false;
    };
  }, []);
  return (
    <LoadingContext.Provider value={loading}>
      {props.children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
