import React from 'react';
import { useInfiniteQuery } from 'react-query';

import { Params, Response } from './useApi';

type PageParam = Params<'/gallery', 'get'>['query'];
type FetchParams = {
  pageParam?: PageParam | undefined;
};

type SuccessfulResponse = Response<'/gallery', 'get'>[200];
type FetchResult = SuccessfulResponse['content']['application/json'];

const useInfiniteGallery = () => {
  const fetchGallery = React.useCallback(
    async ({ pageParam }: FetchParams): Promise<FetchResult> => {
      const response = await fetch(
        `/gallery?from=${pageParam?.from ?? Date.now()}`,
      );
      return await response.json();
    },
    [],
  );

  const { data, isLoading, isError, fetchNextPage } = useInfiniteQuery<
    FetchResult,
    FetchParams
  >('gallery', fetchGallery, {
    getNextPageParam: (results) => {
      if (results.length) {
        return results[results.length - 1].timestamp;
      }
      return undefined;
    },
  });

  return React.useMemo(
    () => ({ data, isLoading, isError, fetchNextPage }),
    [data, fetchNextPage, isError, isLoading],
  );
};

export default useInfiniteGallery;
