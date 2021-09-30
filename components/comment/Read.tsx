import { FC, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import {BiDislike, BiLike} from 'react-icons/bi';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { onSnapshot, query, where, collection, DocumentData, doc } from 'firebase/firestore';
import { httpsCallable } from "firebase/functions";
import { db, functions } from 'utils/firebase';
import Moment from 'react-moment';
import { useAuth } from 'context/Auth';
import { setSnackBar, useSnackBarDispatch } from 'context/SnackBar';
import Delete from './Delete';
import Skeleton from './Skeleton';
import { motion } from 'framer-motion';

const useStyles = makeStyles(() =>
  createStyles({
    root : {
      position : "relative"
    },
    blur : {
      filter : "blur(3px)",
      pointerEvents : "none",
    },
    alert : {
      position : "absolute",
      top : "50%",
      left : "50%",
      transform : "translate(-50%, -50%)",
      zIndex : 1
    },
    comment : {
      overflowWrap : "break-word"
    },
    likedOrDisliked: {
      color : "#08f314"
    },
  }),
);

interface Props {
  movieId : number
};

interface Comment {
  comment : string,
  username : string,
  likes : number,
  dislikes : number,
  createdAt : string,
  id : string,
  spoiler : boolean,
  userid : string
};

interface Spoiler {
  id : string
};


const ReadComments: FC<Props> = ({movieId}) => {
  const [comments, setComments] = useState<DocumentData | Comment[]>([]);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [dislikedComments, setDislikedComments] = useState<string[]>([]);
  const [spoilers, setSpoilers] = useState<Spoiler[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(true);
  const classes = useStyles();
  const dispatch = useSnackBarDispatch();
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "comments"), where("movieId", "==", movieId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allComments: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
          allComments.push({...doc.data(), id : doc.id});
      });
      const spoilers: Spoiler[] = [];
      allComments.map(comment => {
        if(comment.spoiler === true) {
          spoilers.push({ id : comment.id})
        }
      });

      setComments(allComments);
      setSpoilers(spoilers);
      setSkeleton(false); 
    });

    const unsub = onSnapshot(doc(db, "users", `${user?.uid}`), (doc) => {
      setLikedComments(doc.data()?.likedComments);
      setDislikedComments(doc.data()?.dislikedComments);
    });

    return () => {
      unsubscribe(); 
      unsub();
    };
   
  }, [user]);

  const likeComment = httpsCallable(functions, 'likeComment');
  const unlikeComment = httpsCallable(functions, 'unlikeComment');
  const dislikeComment = httpsCallable(functions, 'dislikeComment');
  const revertDislike = httpsCallable(functions, 'revertDislike');

  return (
    <Box>
      {skeleton && <Skeleton />}

      {!skeleton && 
        <Typography variant="subtitle2"> 
          Comments({comments.length})
        </Typography>
      }
      
      {!skeleton && comments.map((item: Comment | DocumentData) => {
        const { username, createdAt, comment, likes, dislikes, id, userid } = item;
        const isLiked = likedComments && (likedComments.find(item => item === id) ? true : false);
        const isDisliked = dislikedComments && (dislikedComments.find(item => item === id) ? true : false);
        const spoiler = spoilers.find(item => item.id === id);
        return (
          <motion.div 
           className={classes.root} key={id}
           initial={{ x : "-100vw"}} animate={{ x : 0}}
          >
            {spoiler && (
              <Button color="secondary" fullWidth className={classes.alert} 
               onClick={() => setSpoilers(spoilers.filter(item => item.id !== id))}
              >
                Spoiler ! You wanna see this comment ? 
              </Button> 
            )}   
            <Box display="flex" p={2} className={spoiler ? classes.blur  : undefined}>
              {userid === user?.uid && <Delete id={id} /> }
              <Box mr={2} mt={0.5}>
                <Avatar alt="Avatar" src="/avatar.png" />
              </Box>
              <Grid container>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Box mr={2}>
                      <Typography variant="subtitle1">
                        {username}
                      </Typography>
                    </Box>
                    <Box color="grey.500">
                      <Typography variant="caption">
                        <Moment fromNow>
                          {createdAt.toDate()}
                        </Moment>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box color="grey.300" mr={7}>
                    <Typography variant="body2" className={classes.comment}>
                      {comment}
                    </Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Box>
                    <IconButton color="secondary" size="large"
                     className={isLiked ? (classes.likedOrDisliked) : undefined} 
                     onClick={() => isLiked ? unlikeComment({id}) : 
                        likeComment({id}).catch(err => dispatch(setSnackBar(true, 'error', `${err.message}`)))}
                    >
                      <BiLike /> {likes}
                    </IconButton>
                    <IconButton color="secondary" size="large" 
                     className={isDisliked ? (classes.likedOrDisliked) : undefined} 
                     onClick={() =>isDisliked ? revertDislike({id}) : 
                        dislikeComment({id}).catch(err => dispatch(setSnackBar(true, 'error', `${err.message}`)))}
                    >
                      <BiDislike /> {dislikes}
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>   
        )          
      })}
    </Box>
  )
};

export default ReadComments;
