import React, { useEffect, useMemo, useState } from "react";
import LoadingContext from "./LoadingContext";
import {
  addGlobalRequestInterceptor,
  addGlobalResponseInterceptor,
  removeGlobalResponseInterceptor,
  removeGlobalRequestInterceptor,
} from "../../util/http";

const LoadingProvider = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [countRequest, setCountRequest] = useState(0);
  useMemo(() => {
    let isSubscribed = true;
    const requestIds = addGlobalRequestInterceptor((config) => {
      if (isSubscribed) {
        setLoading(true);
        setCountRequest((prev) => prev + 1);
      }
      return config;
    });
    const responseIds = addGlobalResponseInterceptor(
      (response) => {
        if (isSubscribed) {
          setCountRequest((prev) => prev - 1);
        }
        return response;
      },
      (error) => {
        if (isSubscribed) {
          setCountRequest((prev) => prev - 1);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      isSubscribed = false;
      removeGlobalRequestInterceptor(requestIds);
      removeGlobalResponseInterceptor(responseIds);
    };
  }, []);

  useEffect(() => {
    if (countRequest === 0) {
      setLoading(false);
    }
  }, [countRequest]);
  return (
    <LoadingContext.Provider value={loading}>
      {props.children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
