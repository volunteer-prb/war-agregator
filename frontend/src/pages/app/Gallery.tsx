import React from 'react';

import Modal from '../../components/Modal';

import useInfiniteGallery from '../../api/useInfiniteGallery';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { components } from '../../api/open-api';

type PictureData = components['schemas']['ImageDto'];

export default function Gallery() {
  const [selectedPictureIdx, setSelectedPictureIdx] = React.useState(null);

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
    <React.Fragment>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-4">
          {data?.pages.map((page) =>
            page.map((val) => <Picture key={val.source} pictureData={val} />),
          )}
          <div ref={loadingRef}>Loading...</div>
        </div>
      </div>
      <Modal isOpen={selectedPictureIdx === null} onClose={console.log}>
        Hello!
      </Modal>
    </React.Fragment>
  );
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
