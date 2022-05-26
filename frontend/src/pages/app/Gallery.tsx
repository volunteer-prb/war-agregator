import React from 'react';
import { useInfiniteQuery } from 'react-query';

import { Response, Params } from '../../api/useApi';

type PageParam = Params<'/gallery', 'get'>['query'];
type FetchParams = {
  pageParam?: PageParam | undefined;
};

type SuccessfulResponse = Response<'/gallery', 'get'>[200];
type FetchResult = SuccessfulResponse['content']['application/json'];

const Gallery = () => {
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

  const loadingRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => {
      if (loadingRef.current && isInViewport(loadingRef.current)) {
        fetchNextPage();
      }
    };
    document.addEventListener('wheel', onScroll);
    return () => document.removeEventListener('wheel', onScroll);
  }, [fetchNextPage]);

  if (isLoading) {
    return <Placeholder>Loading...</Placeholder>;
  }

  if (isError) {
    return <Placeholder className="text-theme-red">Error!</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-4">
        {data?.pages.map((page) =>
          page.map((val) => <Picture key={val.source} pictureData={val} />),
        )}
        <div ref={loadingRef}>Loading...</div>
      </div>
    </div>
  );
};

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function Picture({ pictureData }: { pictureData: FetchResult[0] }) {
  return (
    <div className="bg-slate-200 rounded-xl m-8 p-8 w-fit hover:scale-110 transition-transform">
      <img alt="thumbnail" src={pictureData.thumbnailImgUrl}></img>
      <div> source - {pictureData.source}</div>
      <div> time - {pictureData.timestamp}</div>
    </div>
  );
}

function Placeholder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const classNames = ['flex-1 flex justify-center items-center', className]
    .filter(Boolean)
    .join(' ');
  return <div className={classNames}>{children}</div>;
}

export default Gallery;
