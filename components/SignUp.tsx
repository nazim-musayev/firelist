import { FC, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import { useMediaQuery } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText'; 
import theme from 'src/theme';
import { MdCancel } from 'react-icons/md';
import { BiLock } from 'react-icons/bi';
import { useDialogState, closeDialog, useDialogDispatch, setLogIn } from 'context/Dialog';
import { useSnackBarDispatch, setSnackBar } from 'context/SnackBar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AuthInputs } from 'interfaces';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, functions } from 'utils/firebase';
import { httpsCallable } from 'firebase/functions';
import { motion } from 'framer-motion';


const SignUp : FC = () => {
  const [firebaseError, setFirebaseError] = useState<boolean>(false);
  const sm = useMediaQuery('(max-width:768px)');
  const md = useMediaQuery('(max-width:993px)');
  const snackbarDispatch = useSnackBarDispatch();
  const dialogDispatch = useDialogDispatch();
  const { signup } = useDialogState();

  const validationSchema = Yup.object().shape({
    username : Yup.string().required('Username is required').min(5).max(20),
    email: Yup.string().required('Email is required').email(),
    password: Yup.string().required('Password is required').min(6).max(15)
  });

  const {register, handleSubmit, reset, formState : {errors} } = useForm<AuthInputs>({
    resolver: yupResolver(validationSchema)
  });

  const handleForm : SubmitHandler<AuthInputs> = ({email, password, username} : AuthInputs) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      const createUser = httpsCallable(functions, 'createUser');
      createUser({email, username, uid : user.uid});
      reset();
      dialogDispatch(closeDialog());
      snackbarDispatch(setSnackBar(true, "success", `Signed up as ${username}`));
    })
    .catch(() => setFirebaseError(true));
  };

  const handleClose = () => {
    setFirebaseError(false);
    dialogDispatch(closeDialog());
    reset();
  };

  return (
    <Dialog open={signup} onClose={handleClose} fullScreen={sm ? true : false}>
      <Box p={6} display="flex" flexDirection="column" alignItems="center" 
       width={sm ? "100vw" : md ? "50vw" : "40vw"} height={sm ? "100vh" : "85vh"}  
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
          Sign up
        </Typography>
        <form noValidate onSubmit={handleSubmit(handleForm)}>
          <TextField margin='dense' required fullWidth id="username" label="Username"
           color="secondary" variant="outlined" size="small" 
           {...register('username')} error={errors.username ? true : false} helperText={errors.username?.message}
          />
          <TextField margin="dense" required fullWidth id="email" label="Email Address"
           autoComplete="email" color="secondary" variant="outlined" size="small"
           {...register('email')} error={errors.email ? true : false} helperText={errors.email?.message}
           onChange={() => setFirebaseError(false)}
          />
          <TextField margin="dense" required fullWidth label="Password" type="password"
           id="password" variant="outlined" color="secondary" size="small" 
           {...register('password')} error={errors.password ? true : false} helperText={errors.password?.message}
          />
          {firebaseError && (
            <motion.div initial={{ y : 50 }} animate={{ y : 0}}>
              <FormHelperText error>
                Email is already in use
              </FormHelperText>
            </motion.div>
          )}
          <Box mt={3} mb={2}>
            <Button type="submit" fullWidth variant="contained">
              Sign Up
            </Button>
          </Box>
          <Box display="flex" mb={5}>
            <Box mr={1} color="text.primary" >
              Already have an account?
            </Box>
            <Typography variant="body2" color="textSecondary" onClick={() => dialogDispatch(setLogIn())}>
              Log in
            </Typography>
          </Box>
        </form>
      </Box>
    </Dialog>
  )
};

export default SignUp;
