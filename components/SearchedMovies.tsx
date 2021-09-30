import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { useMediaQuery } from '@material-ui/core';
import { AiFillStar } from 'react-icons/ai'; 
import Image from 'next/image';
import NextLink from 'next/link';
import { useSearchState } from 'context/Search';
import { Movie } from 'interfaces';
import { FC } from 'react';
import { motion } from 'framer-motion';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root : {
      height : (searchedMovies : Movie[]) => {
        return searchedMovies.length > 3 ? "100vh" : "auto"   
      },
      width : "100vw - 16px",
      [theme.breakpoints.up('md')]: {
        width : "60vw",
      },
      [theme.breakpoints.up('xl')]: {
        width : "calc(40vw - 32px)",
      },
    }
  }),
);

const SearchedMovies: FC = () => {
  const { searchedMovies, searchWord } = useSearchState();
  const sm = useMediaQuery('(max-width:766px)');
  const classes = useStyles(searchedMovies);

  return (
    <Paper square>
      {searchWord && (
        <TableContainer className={classes.root}>
          <Box p={3} borderBottom={2}>
            <Typography variant="subtitle1">
              {searchedMovies.length === 0 ? ("No matches found") : (`Best results : ${searchedMovies.length} movies`)}
            </Typography>
          </Box>
          <motion.div initial={{ x: 150 }} animate={{ x : 0}}> 
            <Table>
              <TableBody>
              {searchedMovies.map((movie) => {
               const { id, title, poster_path, vote_average, original_language } = movie;
               return (           
                <TableRow key={id}>
                  <TableCell > 
                    <Image src={`https://image.tmdb.org/t/p/w500${poster_path}`} 
                     alt={title} width={100} height={100} layout="fixed" 
                     placeholder="blur" blurDataURL={`https://image.tmdb.org/t/p/w500${poster_path}`}
                    /> 
                  </TableCell>
                  <TableCell align="left">
                    <NextLink href={`/movie/${id}`} passHref>
                    <Link>
                      <Typography color="primary" variant={sm ? `caption` : `body1`}>
                        {title.slice(0,25)}
                      </Typography>
                    </Link>
                    </NextLink>
                  </TableCell>
                  <TableCell>
                    <Box color="primary.main">
                      {original_language.toUpperCase()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" color="warning.main">
                      <Box mt={0.4}>
                        <AiFillStar /> 
                      </Box>
                      <Box>
                        {vote_average} 
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
               )
               })} 
              </TableBody>
            </Table>
          </motion.div>
        </TableContainer>
      )}
    </Paper>
  )
};

export default SearchedMovies;
