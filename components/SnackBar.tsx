import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useSnackBarState, useSnackBarDispatch, setSnackBar } from 'context/SnackBar';
import { SyntheticEvent, FC } from 'react';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
          marginTop: theme.spacing(2)
      }
    }
  }),
);

const SnackBar : FC = () => {
    const { open, type, message } = useSnackBarState();
    const dispatch = useSnackBarDispatch();
    const classes = useStyles();

  const handleClose = (event : SyntheticEvent, reason? : string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackBar(false, type, message))
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert elevation={6} variant="standard" onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackBar;
