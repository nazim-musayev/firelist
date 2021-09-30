import { FC, useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import { useMediaQuery } from '@material-ui/core';
import { AiFillStar } from 'react-icons/ai';
import { Movies, Movie } from 'interfaces';
import NextLink from 'next/link';
import { onSnapshot, doc } from '@firebase/firestore';
import { httpsCallable } from "firebase/functions";
import { functions, db } from 'utils/firebase';
import { useSnackBarDispatch, setSnackBar } from 'context/SnackBar';
import { useAuth } from 'context/Auth'; 
import { motion } from 'framer-motion';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 200,
      margin : theme.spacing(0,2,5,0),
      [theme.breakpoints.up('sm')]: {
        maxWidth : 225,
        marginLeft : theme.spacing(5)
    },
      [theme.breakpoints.up('md')]: {
        marginLeft : theme.spacing(0)
    },
    },
    title : {
      [theme.breakpoints.up('sm')]: {
        marginLeft : theme.spacing(5)
    },
    },
    media: {
      height: 285,
      position : "relative",
    },
    content : {
      background : "#181a25"
    },
    skeleton : {
      backgroundColor : theme.palette.grey[500],
      height : "7vh"
    }
  }),
);

const buttonVariants = {
  initial : {
   opacity : 0
  },
  animate : {
    opacity : 1
  }
};


const PosterCard: FC<Movies> = ({ movies }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(true);
  const sm = useMediaQuery('(max-width:766px)');
  const classes = useStyles();
  const dispatch = useSnackBarDispatch();
  const { user } = useAuth();
  
  const addMovie = httpsCallable(functions, 'addMovie');
  const removeMovie = httpsCallable(functions, 'removeMovie');
  
  useEffect(()=> {
    const unsubscribe = onSnapshot(doc(db, "users", `${user?.uid}`), (doc) => {
      const movies: Movie[] = doc.data()?.watchlist;
      setWatchlist(movies ? movies : []);
    });

    const timer = setTimeout(() => {
      setSkeleton(false)
    }, 3000);
    
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };

  }, [user]);


  return (
    <Grid container justifyContent="center">
      {movies.map((movie) => {
       const { id, title, poster_path, release_date, vote_average } = movie;
       const alreadyInList = user && watchlist.find(item => item.id === id);
       return (
        <Grid key={id} item xs={6} md={4} lg={3}>
          <Card className={classes.root}>
            <CardActionArea>
              <NextLink href={`movie/${title}`}>
              <Link underline="none">
                <CardMedia className={classes.media} title={title}
                 image={`https://image.tmdb.org/t/p/w500${poster_path}`}
                >
                  <Box position="absolute" bottom={5} left={5} display="flex" 
                   justifyContent="space-around" width={30} color="warning.main"
                  >
                    <Box position="relative" top={2}>
                      <AiFillStar /> 
                    </Box>
                    <Box>
                      {vote_average} 
                    </Box>
                  </Box>
                  <Box position="absolute" bottom={5} right={5}>
                    {release_date.slice(0, 4)}
                  </Box>  
                </CardMedia> 
                <CardContent className={classes.content}>
                  <Typography variant="body2" color="primary">
                    {title.length > (sm ? 15 : 20) ? (`${title.slice(0, sm ? 14 : 18)}...`) : title }
                  </Typography>
                </CardContent> 
              </Link>
              </NextLink>
            </CardActionArea>
            {skeleton && <Skeleton variant="rect" className={classes.skeleton} />}
            {!skeleton && (
              <motion.div variants={buttonVariants} initial="initial" animate="animate">
                {
                  alreadyInList ? (
                    <Button variant="outlined" size="small" fullWidth 
                    onClick={() => removeMovie({id})}
                    >
                      {sm ? `Remove` : `Remove from list`}
                    </Button>
                  ) : (
                    <Button color="secondary" variant="outlined" size="small" fullWidth 
                    onClick={() => addMovie({movie}).catch((err) => dispatch(setSnackBar(true, 'error', `${err.message}`)))}
                    >
                     Add To List
                   </Button>
                  )
                }
              </motion.div>
            )}
          </Card>  
        </Grid>
       )
      })}
    </Grid>           
  );
};

export default PosterCard;
