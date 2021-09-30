import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MuiSkeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import { FC } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    skeleton : {
      backgroundColor : theme.palette.grey[500]
    }
  }),
);

const Skeleton: FC = () => {
  const classes = useStyles();

  return (
    <>
      {(Array.from(new Array(3)).map((item, index) => (
        <Box key={index} p={3} ml={3}>
        <Box display="flex">
          <Box>
            <MuiSkeleton variant="circle" width={40} height={40} className={classes.skeleton} />
          </Box>
          <Box ml={2}>
            <MuiSkeleton variant="text" width="15vw" className={classes.skeleton} />
            <MuiSkeleton variant="text" width="40vw" className={classes.skeleton} />
            <Box display="flex" width="5vw" justifyContent="space-around">
              <MuiSkeleton variant="rect" width={15} height={15} className={classes.skeleton} />
              <MuiSkeleton variant="rect" width={15} height={15} className={classes.skeleton} />
            </Box>
          </Box>    
        </Box>
      </Box>     
      )))}
    </>
  )
};

export default Skeleton;
