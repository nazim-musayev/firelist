import { FC } from 'react';
import { Movies } from 'interfaces';
import Typography from '@material-ui/core/Typography';
import { useMediaQuery } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import Grid6 from './Grid6';
import Grid12 from './Grid12';


const BackdropCard: FC<Movies> = ({movies}) => {
  const lg = useMediaQuery('(min-width:992px)');

  return (
    <Grid container spacing={lg ? 0 : 5}>
      <Grid item xs={12} lg={6} container >
        <Grid item xs={12}>
          <Typography variant="overline" color="primary">
            Most Watched
          </Typography>
        </Grid>
        <Grid12 movie={movies[0]} />
        <Grid6 movie={movies[1]} />
        <Grid6 movie={movies[2]} />
      </Grid>
      <Grid item xs={12} lg={6} container>
        <Grid item xs={12}>
          <Typography variant="overline" color="primary">
            New Movies
          </Typography>
        </Grid>
        <Grid6 movie={movies[3]} />
        <Grid6 movie={movies[4]} />
        <Grid12 movie={movies[5]} />
      </Grid>
    </Grid>
  );
}

export default BackdropCard;
