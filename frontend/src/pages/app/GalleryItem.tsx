import React from 'react';
import classNames from 'classnames';

import * as Icons from '../../components/Icons';

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
      <Button onClick={onClickPrev}>
        <Icons.ChevronLeft />
      </Button>
      <Picture picture={picture} />
      <Button onClick={onClickNext}>
        <Icons.ChevronRight />
      </Button>
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
    <div className="p-4 flex flex-col justify-center items-center grow space-y-4">
      <div>
        <img alt="thumbnail" src={picture.thumbnailImgUrl} />
      </div>
      <div>{picture.description}</div>
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

type ButtonProps = {
  children: React.ReactNode;
  onClick: undefined | (() => void);
};

function Button({ children, onClick }: ButtonProps) {
  return (
    <div
      className={classNames('flex items-center px-4', {
        'hover:bg-theme-main': onClick,
        'cursor-not-allowed': !onClick,
      })}
      role="button"
      aria-disabled={!onClick}
      onClick={onClick}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
