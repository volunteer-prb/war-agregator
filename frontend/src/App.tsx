import React from 'react';
import logo from './logo.svg';
import './App.css';
import { QueryClient, QueryClientProvider, useQueries, useQuery } from "react-query";
import { Response, useApi } from './useApi';

const queryClient = new QueryClient();

function Picture({ pictureData }: { pictureData: Response<'/gallery', 'get'>[200]['content']['application/json'][0] }) {
  return <div>
    <img src={pictureData.originalImgUrl}></img>
    <div> source - {pictureData.source}</div>
    <div> time - {pictureData.timestamp}</div>
  </div>
}

function Gallery() {
  const result = useApi('/gallery', 'get', { query: {} })
  console.log(result)
  if (result.status === 'success' && result.statusCode === 200)

    return <>{result.value.map((val) => <Picture pictureData={val} />
    )}</>
  else
    return <div>{result.status}</div>
}

function App() {

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Gallery />
      </QueryClientProvider>
    </div>
  );
}

export default App;
