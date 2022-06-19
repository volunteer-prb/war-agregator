import React from 'react';
import classNames from 'classnames';

import Modal from '../../components/Modal';

import useInfiniteGallery from '../../api/useInfiniteGallery';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

import type { ImageDto } from '../../api/types';
import GalleryItem from './GalleryItem';

export default function Gallery() {
  const [selectedPictureIdx, setSelectedPictureIdx] = React.useState<
    number | null
  >(null);

  const { data, isLoading, isError, fetchNextPage, hasMore } =
    useInfiniteGallery();
  const allPictures = React.useMemo(() => data?.pages.flat() ?? [], [data]);

  const maybeFetchNextPage = React.useCallback(async () => {
    if (hasMore) {
      await fetchNextPage();
    }
  }, [hasMore, fetchNextPage]);

  const loadingRef = React.useRef(null);
  useInfiniteScroll(loadingRef, maybeFetchNextPage);

  React.useEffect(() => {
    if (selectedPictureIdx === allPictures.length - 1) {
      maybeFetchNextPage();
    }
  }, [allPictures.length, maybeFetchNextPage, selectedPictureIdx]);

  const closeModal = React.useCallback(() => setSelectedPictureIdx(null), []);

  const onPictureClick = React.useCallback((idx: number) => {
    setSelectedPictureIdx(idx);
  }, []);

  const selectPrevPicture = React.useCallback(
    () =>
      setSelectedPictureIdx((currentIdx) =>
        currentIdx === null ? null : currentIdx - 1,
      ),
    [],
  );

  const selectNextPicture = React.useCallback(
    () =>
      setSelectedPictureIdx((currentIdx) =>
        currentIdx === null ? null : currentIdx + 1,
      ),
    [],
  );

  if (isLoading) {
    return <Placeholder>Loading...</Placeholder>;
  }

  if (isError) {
    return <Placeholder className="text-theme-red">Error!</Placeholder>;
  }

  const selectedPicture =
    selectedPictureIdx === null ? null : allPictures[selectedPictureIdx];
  const hasNext =
    selectedPictureIdx !== null && selectedPictureIdx < allPictures.length;
  const hasPrev = selectedPictureIdx !== null && selectedPictureIdx > 0;

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
      <Modal isOpen={!!selectedPicture} onClose={closeModal}>
        {selectedPicture && (
          <GalleryItem
            picture={selectedPicture}
            onClickNext={hasNext ? selectNextPicture : undefined}
            onClickPrev={hasPrev ? selectPrevPicture : undefined}
          />
        )}
      </Modal>
    </React.Fragment>
  );
}

type PictureProps = {
  pictureData: ImageDto;
  onClick: () => void;
};

function Picture({ pictureData, onClick }: PictureProps) {
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

type PlaceholderProps = {
  children: React.ReactNode;
  className?: string;
};

function Placeholder({ children, className }: PlaceholderProps) {
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
