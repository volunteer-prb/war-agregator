import React from 'react';

import { Response, useApi } from '../../api/useApi';

const Gallery = () => {
  const result = useApi('/gallery', 'get', { query: {} });

  if (result.status === 'success' && result.statusCode === 200) {
    return (
      <div className="flex-1 grid grid-cols-4 overflow-auto">
        {result.value.map((val) => (
          <Picture pictureData={val} />
        ))}
      </div>
    );
  }

  return <div>{result.status}</div>;
};

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
