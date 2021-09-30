import { FC, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from "@material-ui/core/Dialog";
import { useMediaQuery } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import theme from 'src/theme';
import { BiLock } from 'react-icons/bi';
import { MdCancel } from 'react-icons/md'; 
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AuthInputs } from 'interfaces';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from 'utils/firebase';
import { useDialogState, closeDialog, useDialogDispatch, setSignUp } from 'context/Dialog';
import { useSnackBarDispatch, setSnackBar } from 'context/SnackBar';
import { motion } from 'framer-motion';


const Login: FC = () => {
  const [loginError, setLoginError] = useState<boolean>(false);
  const { login } = useDialogState();
  const snackBarDispatch = useSnackBarDispatch();
  const dialogDispatch = useDialogDispatch();
  const sm = useMediaQuery('(max-width:767px)');
  const md = useMediaQuery('(max-width:992px)');

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email(),
    password: Yup.string().required('Password is required').min(6).max(15)
  });

  const {register, handleSubmit, reset, formState : {errors} } = useForm<AuthInputs>({
    resolver: yupResolver(validationSchema)
  });

  const handleForm : SubmitHandler<AuthInputs> = ({email, password} : AuthInputs) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      reset();
      setLoginError(false);
      dialogDispatch(closeDialog());
      snackBarDispatch(setSnackBar(true, "success", "Logged in"));
    })
    .catch(() => setLoginError(true));
  };

  const handleChange = () => {
    setLoginError(false)
  };

  const handleClose = () => {
    dialogDispatch(closeDialog());
    reset();
    setLoginError(false);
  };

  return (
    <Dialog open={login} onClose={handleClose} fullScreen={sm ? true : false}>
      <Box p={6} display="flex" flexDirection="column" alignItems="center" 
       width={sm ? "100vw" : md ? "50vw" : "40vw"} height={sm ? "100vh" : "80vh"} 
       bgcolor={theme.palette.background.paper}
      >
        <Box position="absolute" top={10} right={10}>
          <IconButton onClick={handleClose} color="secondary">
            <MdCancel />
          </IconButton>
        </Box>
        <Box m={1}>
          <Avatar>
            <BiLock  />
          </Avatar>
        </Box>
        <Typography variant="h5" color="textPrimary" gutterBottom>
            Log in
        </Typography>
        <form noValidate onSubmit={handleSubmit(handleForm)} onChange={handleChange}>
          <TextField margin="dense" required fullWidth id="email" label="Email Address" 
           type="email" autoComplete="email" color="secondary" variant="outlined" size="small" 
           {...register('email')} error={errors.email ? true : false} helperText={errors.email?.message}
          />
          <TextField margin="dense" required fullWidth label="Password" type="password" 
           id="password" variant="outlined" color="secondary" size="small"
           {...register('password')} error={errors.password ? true : false} helperText={errors.password?.message}
          />
          {loginError && (
            <motion.div initial={{ y : 50 }} animate={{ y : 0}}>
              <FormHelperText error>
                Wrong email or password
              </FormHelperText>
            </motion.div>
            
          )}
          <Box mt={3} mb={2}>
            <Button type="submit" fullWidth variant="contained">
              Log In
            </Button>
          </Box>
          <Box display="flex">
            <Box mr={1} color="text.primary">
              Don't have an account?
            </Box>
            <Typography variant="body2" color="textSecondary" onClick={() => dialogDispatch(setSignUp())}>
              Sign Up
            </Typography>
          </Box>
          </form>
        </Box>
      </Dialog>
  );
}

export default Login;
