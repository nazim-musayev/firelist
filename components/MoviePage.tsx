import { FC } from 'react';
import { MovieItem } from 'interfaces';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Hidden from '@material-ui/core/Hidden';
import Image from 'next/image';
import Add from 'components/comment/Add';
import Read from 'components/comment/Read'; 
import { useAuth } from 'context/Auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    skeleton : {
      backgroundColor : theme.palette.grey[500],
      height : "10vh"
    }
  }),
);

const MoviePage: FC<MovieItem> = ({movie}) => {
  const { title, release_date, poster_path, overview, genres, vote_average, original_language, vote_count, id} = movie;
  const classes = useStyles();
  const { loading } = useAuth(); 

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="overline">
            {title.slice(0,25)}
          </Typography>
          <Typography variant="subtitle1">
            ({release_date.slice(0,4)})
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" mb={3} justifyContent="space-around" border={1} borderColor="secondary.main">
          {genres.map(({id, name}) => (
            <Typography key={id} variant="subtitle2"  >
              {name.toUpperCase()}
            </Typography>
          ))}
        </Box>
      </Grid>
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={4}>
          <Image src={`https://image.tmdb.org/t/p/w500${poster_path}`} width={100} height={170} layout="responsive"
           placeholder="blur" blurDataURL={`https://image.tmdb.org/t/p/w500${poster_path}`}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body2" align="justify">
            {overview}
          </Typography>
          <Hidden smDown>
            <Box display="flex" flexDirection="column" justifyContent="space-between" mt={3}>
              <Typography variant="subtitle2" color="secondary">
                Language : {original_language.toUpperCase()}
              </Typography>
              <Typography variant="subtitle2" color="secondary">
                Watched : {vote_count} times
              </Typography>
              <Typography variant="subtitle2" color="secondary">
                IMDB : {vote_average}
              </Typography>
            </Box>   
          </Hidden>
        </Grid>
        <Hidden mdUp>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-around">
            <Typography variant="subtitle2">
              Language : {original_language.toUpperCase()}
            </Typography>
            <Typography variant="subtitle2">
              Watched : {vote_count} times
            </Typography>
            <Typography variant="subtitle2">
              IMDB : {vote_average}
            </Typography>
          </Box>
        </Grid>
        </Hidden>
        <Grid item xs={12} lg={8}>
          {loading && <Skeleton variant="rect" className={classes.skeleton} /> }
          {!loading && <Add movieId={id} />}
        </Grid>
        <Grid item xs={12} lg={8}>
          <Read movieId={id} />
        </Grid>
      </Grid>
    </Grid>
  )
};

export default MoviePage;
