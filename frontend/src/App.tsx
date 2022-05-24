import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Response, useApi } from './useApi';

const queryClient = new QueryClient();

function Picture({
  pictureData,
}: {
  pictureData: Response<
    '/gallery',
    'get'
  >[200]['content']['application/json'][0];
}) {
  return (
    <div className="bg-slate-100 rounded-xl m-8 p-8 w-fit hover:scale-110 transition-transform">
      <img alt="thumbnail" src={pictureData.thumbnailImgUrl}></img>
      <div> source - {pictureData.source}</div>
      <div> time - {pictureData.timestamp}</div>
    </div>
  );
}

function Header() {
  return (
    <div className="pb-2 border-b wx-8 sticky top-0 border-theme-secondary backdrop-blur">
      <div className="text-lg px-4">
        <span className="font-bold">War aggregator</span>
        <span className="text-theme-red text-3xl">.</span>
      </div>
    </div>
  );
}

function Gallery() {
  const result = useApi('/gallery', 'get', { query: {} });
  console.log(result);
  if (result.status === 'success' && result.statusCode === 200)
    return (
      <div className="grid grid-cols-4">
        {result.value.map((val) => (
          <Picture pictureData={val} />
        ))}
      </div>
    );
  else return <div>{result.status}</div>;
}

function App() {
  return (
    <div className="bg-theme-main">
      <QueryClientProvider client={queryClient}>
        <Header />
        <Gallery />
      </QueryClientProvider>
    </div>
  );
}

export default App;
