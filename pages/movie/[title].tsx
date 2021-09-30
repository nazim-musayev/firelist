import { GetStaticPaths, GetStaticProps } from 'next';
import { MovieItem, Movie, Genre } from 'interfaces';
import { FC } from 'react';
import MoviePage from 'components/MoviePage';
import Meta from 'components/Meta';
import Box from '@material-ui/core/Box';


export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=cdae07b1f9ce60839ccc6c640357278f&language=en-US&page=1");
  const data = await res.json();
  const movies: Movie[] = data.results;

  const paths = movies.map((movie) => ({
    params : {
      title : movie.title
    }
  }));

  return {
    paths,
    fallback: false
  };

};

type Genres = {
 genres : Genre[]
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const key = process.env.NEXT_PUBLIC_APP_TMDB_KEY;
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&page=1&include_adult=false&query=${params?.title}`);
  const data = await res.json();
  const ids: number[] = data.results[0].genre_ids;
  const resp = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`);
  const { genres }: Genres = await resp.json();
  let genreNames: Genre[] = [];

  ids.map((id) => {
    genres.map((genre) => {
      if(id === genre.id) { 
        genreNames.push(genre)
      };
    });
  });

  const movie : MovieItem = {...data.results[0], genres : genreNames};

  return {
    props : { movie }
  };
  
};

const title: FC<MovieItem> = ({movie}) => {
  return (
    <>
    <Meta title={movie.title} />
    <Box ml={3} mr={1} my={5}>
      <MoviePage movie={movie} />
    </Box>
    </>
  );
};

export default title;
