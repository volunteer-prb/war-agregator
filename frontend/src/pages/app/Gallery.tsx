import React from 'react';
import { useInfiniteQuery } from 'react-query';

import { Response } from '../../api/useApi';

const Gallery = () => {
  const fetchGallery = React.useCallback(async (args: any) => {
    const { pageParam: from } = args;
    const response = await fetch(`/gallery?from=${from ?? Date.now()}`);
    const results = await response.json();
    return { results };
  }, []);

  const { data, isLoading, isError, fetchNextPage } = useInfiniteQuery(
    'gallery',
    fetchGallery as any,
    {
      getNextPageParam: ({ results }: any) => {
        if (results.length) {
          return results[results.length - 1].timestamp;
        }
        return undefined;
      },
      getPreviousPageParam: ({ results }: any) => {
        if (results.length) {
          return results[0].timestamp;
        }
        return undefined;
      },
    },
  );

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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!</div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-4">
        {(data as any).pages.map((page: any) =>
          page.results.map((val: any) => (
            <Picture key={val.source} pictureData={val as any} />
          )),
        )}
        <div ref={loadingRef}>Loading...</div>
      </div>
    </div>
  );
};

function isInViewport(el: any) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function Picture({
  pictureData,
}: {
  pictureData: Response<
    '/gallery',
    'get'
  >[200]['content']['application/json'][0];
}) {
  return (
    <div className="bg-slate-200 rounded-xl m-8 p-8 w-fit hover:scale-110 transition-transform">
      <img alt="thumbnail" src={pictureData.thumbnailImgUrl}></img>
      <div> source - {pictureData.source}</div>
      <div> time - {pictureData.timestamp}</div>
    </div>
  );
}

export default Gallery;
