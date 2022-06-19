import React from 'react';

import type { ImageDto } from '../../api/types';

type Props = {
  picture: ImageDto;
  onClickPrev: undefined | (() => void);
  onClickNext: undefined | (() => void);
};

export default function GalleryItem(props: Props) {
  const { picture, onClickNext, onClickPrev } = props;

  useKeyboardControls(onClickPrev, onClickNext);

  return (
    <div className="flex">
      <div role="button" tabIndex={0} onClick={onClickPrev}>
        Back
      </div>
      <Picture picture={picture} />
      <div role="button" tabIndex={0} onClick={onClickNext}>
        Forward
      </div>
    </div>
  );
}

function useKeyboardControls(
  onClickPrev: undefined | (() => void),
  onClickNext: undefined | (() => void),
) {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowRight':
          onClickNext?.();
          return;
        case 'ArrowLeft':
          onClickPrev?.();
          return;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClickNext, onClickPrev]);
}

function Picture({ picture }: { picture: ImageDto }) {
  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <div>
        <img alt="thumbnail" src={picture.thumbnailImgUrl} />
      </div>
      <div>
        <div>{picture.date}</div>
        <a
          className="text-blue-600 visited:text-purple-600"
          href={picture.source}
          target="_blank"
          rel="noreferrer"
        >
          {picture.source}
        </a>
      </div>
    </div>
  );
}
