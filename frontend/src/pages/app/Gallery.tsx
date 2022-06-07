import React, { ReactNode } from 'react';

import useInfiniteGallery from '../../api/useInfiniteGallery';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { components } from '../../api/open-api';

type PictureData = components['schemas']['ImageDto'];

export default function Gallery() {
  const { data, isLoading, isError, fetchNextPage } = useInfiniteGallery();

  const loadingRef = React.useRef(null);
  useInfiniteScroll(loadingRef, fetchNextPage);

  if (isLoading) {
    return <Placeholder>Loading...</Placeholder>;
  }

  if (isError) {
    return <Placeholder className="text-theme-red">Error!</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-4">
        <Pictures pages={data?.pages || []} />
        <div ref={loadingRef}>Loading...</div>
      </div>
    </div>
  );
}

function Pictures(props: { pages: Array<Array<PictureData>> }) {
  const elements: Array<ReactNode> = [];
  let counter = 0;

  props.pages.forEach((page) =>
    page.forEach((val) => {
      if (counter === 8 && elements.length > 0) {
        elements.push(<div className="separator">Separator</div>);
        counter = 0;
      }
      elements.push(<Picture key={val.source} pictureData={val} />);
      counter++;
    }),
  );

  return <React.Fragment>{elements}</React.Fragment>;
}

function Picture({ pictureData }: { pictureData: PictureData }) {
  return (
    <div className="bg-slate-200 rounded-xl m-8 p-8 w-fit hover:scale-110 transition-transform">
      <img alt="thumbnail" src={pictureData.thumbnailImgUrl}></img>
      <div> source - {pictureData.source}</div>
      <div> date - {pictureData.date}</div>
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
