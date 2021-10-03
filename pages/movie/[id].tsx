import { GetStaticPaths, GetStaticProps } from 'next';
import { MovieItem, Movie } from 'interfaces';
import { FC } from 'react';
import MoviePage from 'components/MoviePage';
import Meta from 'components/Meta';
import Box from '@material-ui/core/Box';
 
const key = process.env.NEXT_PUBLIC_APP_TMDB_KEY;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&page=1`);
  const data = await res.json();
  const movies: Movie[] = data.results;

  const paths = movies.map((movie) => ({
    params : {
      id : movie.id.toString()
    }
  }));

  return {
    paths,
    fallback: false
  };

};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${params?.id}?api_key=${key}&language=en-US`);
  const movie = await res.json();

  return {
    props : { movie}
  };
  
};

const Title: FC<MovieItem> = ({movie}) => {
  return (
    <>
    <Meta title={movie.title} />
    <Box ml={3} mr={1} my={5}>
      <MoviePage movie={movie} />
    </Box>
    </>
  );
};

export default Title;
