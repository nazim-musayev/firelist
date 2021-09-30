import { FC, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { MdDelete } from 'react-icons/md';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { httpsCallable } from "firebase/functions";
import { functions } from 'utils/firebase';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteIcon : {
      cursor: "pointer",
      color : theme.palette.error.main,
      width : "20px",
      height : "20px"
    }
  }),
);

const deleteVariants = {
  initial : {
    x : 100,
    opacity : 0
  },
  animate : {
    x : 0,
    opacity : 1,
    transition : {
      delay : 1
    }
  }
};

interface Props {
    id : string
};

const DeleteComment: FC<Props> = ({id}) => {
  const [dialog, setDialog] = useState<boolean>(false);
  const classes = useStyles();

  const handleDelete = () => {
    setDialog(false);
    const deleteComment = httpsCallable(functions, 'deleteComment');
    deleteComment({id});
  };

  return (
    <Box position="absolute" top={30} right={15}>
      <motion.div onClick={() => setDialog(true)}
        variants={deleteVariants} initial="initial" animate="animate"
      >
          <MdDelete className={classes.deleteIcon}  />
      </motion.div>
      <Dialog open={dialog} onClose={() => setDialog(false)}>
        <DialogTitle>
          Are you sure ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="primary">
            This action undoable. Be sure before clicking yes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setDialog(false)}>
            No
          </Button>
          <Button color="primary" onClick={handleDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
};

export default DeleteComment;
