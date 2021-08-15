import { useState, useEffect } from 'react';
import { instance, tmdbUrl } from './axios'
import './Row.scss';

type Props = {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
};

type Movie = {
  id: string;
  name: string;
  title: string;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
};

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchData() {
      const request = await instance.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const isImageExist = (movie: Movie): Boolean => {
    return movie.poster_path != null && movie.backdrop_path != null
  }

  return(
    <div className="Row">
      <h2>{title}</h2>
      <div className="Row-posters">
        {/* eslint-disable-next-line array-callback-return */}
        {movies.map((movie) => { if (isImageExist(movie)) {
          return <img
                  key={movie.id}
                  className={`Row-poster ${isLargeRow && "Row-poster-large"}`}
                  src={`${tmdbUrl.image.original}${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                  }`}
                  alt={movie.name}
                />
          }}
        )}
      </div>
    </div>
  );
};
