import React from 'react';
import classNames from 'classnames';

import Modal from '../../components/Modal';

import useInfiniteGallery from '../../api/useInfiniteGallery';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { components } from '../../api/open-api';

type PictureData = components['schemas']['ImageDto'];

export default function Gallery() {
  const [selectedPictureIdx, setSelectedPictureIdx] = React.useState<
    number | null
  >(null);

  const { data, isLoading, isError, fetchNextPage } = useInfiniteGallery();
  const allPictures = React.useMemo(() => data?.pages.flat() ?? [], [data]);

  const loadingRef = React.useRef(null);
  useInfiniteScroll(loadingRef, fetchNextPage);

  const closeModal = React.useCallback(() => setSelectedPictureIdx(null), []);

  const onPictureClick = React.useCallback((idx: number) => {
    setSelectedPictureIdx(idx);
  }, []);

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
          {allPictures.map((picture, idx) => (
            <Picture
              key={`${picture.source}-${idx}`}
              pictureData={picture}
              onClick={() => onPictureClick(idx)}
            />
          ))}
          <div ref={loadingRef}>Loading...</div>
        </div>
      </div>
      <Modal isOpen={selectedPictureIdx !== null} onClose={closeModal}>
        Hello!
      </Modal>
    </React.Fragment>
  );
}

function Picture({
  pictureData,
  onClick,
}: {
  pictureData: PictureData;
  onClick: () => void;
}) {
  const onLinkClick = React.useCallback(
    (event: React.MouseEvent) => event.stopPropagation(),
    [],
  );
  return (
    <div
      className="bg-slate-200 rounded-xl m-8 p-8 w-fit hover:scale-110 transition-transform space-y-4"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div>
        <img alt="thumbnail" src={pictureData.thumbnailImgUrl} />
      </div>
      <div>
        <div>{pictureData.date}</div>
        <div onClick={onLinkClick}>
          <a
            className="text-blue-600 visited:text-purple-600"
            href={pictureData.source}
            target="_blank"
            rel="noreferrer"
          >
            {pictureData.source}
          </a>
        </div>
      </div>
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
  return (
    <div
      className={classNames(
        'flex-1 flex justify-center items-center',
        className,
      )}
    >
      {children}
    </div>
  );
}
