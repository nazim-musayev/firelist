import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { FC } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Movie } from 'interfaces';
import { httpsCallable } from '@firebase/functions';
import { functions } from 'utils/firebase';

const useStyles = makeStyles(() =>
  createStyles({
    card : {
      background : "#181a25"
    }
  }),
);

interface Props {
  watchlist : Movie[]
};

const WatchlistCard: FC<Props> = ({watchlist}) => {
  const removeMovie = httpsCallable(functions, 'removeMovie');
  const xs = useMediaQuery('(max-width:575px)');
  const sm = useMediaQuery('(max-width:766px)');
  const md = useMediaQuery('(max-width:992px)');
  const classes = useStyles();

  return (
    <Box mx={xs ? 4 : sm ? 6 : md ? 10 : 20} my={5}>
      {watchlist.map((movie) => {
        const { id, title, poster_path, release_date, overview } = movie;
        return (
          <Box key={id} display="flex" position="relative" mb={3}  
           className={classes.card}
          >
            <Image src={`https://image.tmdb.org/t/p/w500${poster_path}`}  
             alt={title} placeholder="blur" width={500} height={300} 
             blurDataURL={`https://image.tmdb.org/t/p/w500${poster_path}`}
            />
            <Box p={1} width={600} height={xs ? "35vh" : sm ? "60vh" : "70vh"}>
              <NextLink href={`/movie/${title}`} passHref>
              <Link>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant={sm ? "subtitle1" : "h6"}>
                    {title.length > 13 ? (sm ? `${title.slice(0,12)}..` : title) : title}  
                  </Typography>
                  <Typography variant="caption">
                    {`(${release_date.slice(0,4)})`}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" align="justify">
                    {overview.slice(0, xs ? 150 : sm ? 200 : 500)}...
                  </Typography>
                </Box>
              </Link>
              </NextLink>
              <Box position="absolute" bottom={5}>
                <Button variant="outlined" size="small" onClick={() => removeMovie({id})}>
                  Remove from list
                </Button>
              </Box>
            </Box> 
          </Box>
        )
      })} 
    </Box>
  )
}

export default WatchlistCard;
