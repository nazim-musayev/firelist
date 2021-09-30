import { FC, useState, ChangeEvent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import InputBase from '@material-ui/core/InputBase';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { BsInfoCircle } from 'react-icons/bs';
import Typography from '@material-ui/core/Typography';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { functions } from 'utils/firebase';
import { httpsCallable } from "firebase/functions";
import { setLogIn, setSignUp, useDialogDispatch } from 'context/Dialog';
import { useAuth } from 'context/Auth';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
   input : {
    color : theme.palette.primary.main,
    padding : theme.spacing(1.5,2)
   },
   infoArea : {
     backgroundColor : "#491f1f"
   }
  }),
);

interface Props {
  movieId : number
};

interface Input {
  comment : string,
  checkBox : boolean
};

const AddComment: FC<Props> = ({movieId}) => {
  const xs = useMediaQuery('(max-width:575px)')
  const classes = useStyles();
  const dispatch = useDialogDispatch();
  const { user } = useAuth();

  const validationSchema = Yup.object().shape({
    comment : Yup.string().required(`Comment can't be empty`).min(3)
  });

  const {register, handleSubmit, reset, formState : {errors}, control } = useForm<Input>({
    resolver: yupResolver(validationSchema),
    defaultValues : {
      checkBox : false,
      comment : ''
    }
  });

  const handleForm : SubmitHandler<Input> = ({comment, checkBox} :Input) => {
    const addComment = httpsCallable(functions, 'addComment');
    addComment({comment, checkBox, movieId});
    reset();
  };

  return (
    <Box my={2}>
      {user ? (
        <form noValidate onSubmit={handleSubmit(handleForm)}>
          <Box bgcolor="text.disabled" borderRadius={15}>
            <InputBase placeholder="Write a comment.." multiline required fullWidth
             {...register("comment")} error={errors.comment ? true : false} className={classes.input}
            />
          </Box>
          <FormHelperText error variant="outlined">
            {errors.comment?.message}
          </FormHelperText>
          <Box display="flex" mx={1}>
            <Box flexGrow={1}>
              <FormControlLabel label="Spoiler Alert ?" control={
                <Controller name="checkBox" control={control} 
                 render={ ({field : {value, onChange}}) => <Checkbox  checked={value} onChange={onChange} /> } 
                />
                } 
              />
            </Box>
            <Button color="secondary" size="small" type="submit">
              Add Comment
            </Button>
          </Box>
        </form>
        ) : (
        <Box className={classes.infoArea} p={2} display="flex" alignItems="center">
          <Box clone width={xs ? 50 : 20} height={xs ? 50 : 20} mr={2}>
            <BsInfoCircle />
          </Box>
          <Typography color="primary" variant="body2">
            Only users can add comments
          </Typography>
          <Button size="small" color="secondary" onClick={() => dispatch(setLogIn())}>
            Login
          </Button>
          <Typography color="primary" variant="body2">
            or
          </Typography>
          <Button size="small" color="secondary" onClick={() => dispatch(setSignUp())}>
            SignUp
          </Button>
        </Box> 
      )}   
    </Box>
  )
};

export default AddComment;
