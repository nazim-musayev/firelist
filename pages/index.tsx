import { FC } from 'react';
import { useMediaQuery } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Poster from 'components/cards/Poster';
import Backdrop from 'components/cards/Backdrop';
import { GetStaticProps } from 'next';
import { Movies } from 'interfaces';


export const getStaticProps: GetStaticProps = async () => {
 const key = process.env.NEXT_PUBLIC_APP_TMDB_KEY;
 const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&page=1`);
 const data = await res.json();
 const movies: Movies = data.results;
 
  return {
    props : { movies }
  }
};


const Home: FC<Movies> = ({movies}) => {
  const sm = useMediaQuery('(max-width:767px)');
  const md = useMediaQuery('(max-width:992px)');

  return (
    <Box mt={5} mx={sm ? 3 : md ? 13 : 15}>
      <Backdrop movies={movies} />
      <Box mt={7} mb={1}>
        <Typography variant="overline">
          All Movies
        </Typography> 
      </Box>
      <Poster movies={movies} />
    </Box>
  );
};

export default Home;
