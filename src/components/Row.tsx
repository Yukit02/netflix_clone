import { useState, useEffect } from 'react';
import { instance, tmdbUrl, fetchTrailerUrl } from '../axios'
import YouTube from 'react-youtube';
import '../styles/components/Row.scss'

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

//trailerのoption
type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};

const opts: Options = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 1,
  },
};

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");

  useEffect(() => {
    async function fetchData() {
      const request = await instance.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = async (movie: Movie) => {
    let trailerurl = await fetchTrailerUrl(movie.id);
    setTrailerUrl(trailerurl.data.results[0]?.key);
  };

  const isImageExist = (movie: Movie): Boolean => {
    return movie.poster_path != null && movie.backdrop_path != null
  }

  return(
    <div className="Row">
      <h2 className="Row-title">{title}</h2>
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
                  onClick={() => handleClick(movie)}
                />
          }}
        )}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};
