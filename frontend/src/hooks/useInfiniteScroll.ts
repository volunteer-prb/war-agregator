import React from 'react';

export default function useInfiniteScroll(
  loadingRef: React.MutableRefObject<HTMLElement | null>,
  fetchNextPage: () => unknown,
) {
  React.useEffect(() => {
    const onScroll = () => {
      if (loadingRef.current && isInViewport(loadingRef.current)) {
        fetchNextPage();
      }
    };
    document.addEventListener('wheel', onScroll);
    return () => document.removeEventListener('wheel', onScroll);
  }, [fetchNextPage, loadingRef]);
}

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
