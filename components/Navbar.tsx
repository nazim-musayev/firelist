import { FC } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { useMediaQuery } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { BsFillPersonDashFill, BsFillPersonCheckFill } from 'react-icons/bs'
import { AiFillHome } from 'react-icons/ai';
import NextLink from 'next/link';
import SearchBar from './SearchBar';
import SearchedMovies from './SearchedMovies';
import { setLogIn, setSignUp, useDialogDispatch } from 'context/Dialog';
import { setSnackBar, useSnackBarDispatch } from 'context/SnackBar';
import { useAuth } from 'context/Auth';
import { signOut } from '@firebase/auth';
import { auth } from "utils/firebase";
import { motion } from 'framer-motion';


const Navbar: FC = () => {
  const md = useMediaQuery('(min-width:766px)');
  const lg = useMediaQuery('(min-width:992px');
  const snackbarDispatch = useSnackBarDispatch();
  const dialogDispatch = useDialogDispatch();
  const { loading, user } = useAuth();

  const handleLogoutClick = () => {
    signOut(auth);
    snackbarDispatch(setSnackBar(true, "info", "Logged out"));
  };

  return (
    <nav>
      <Box display="flex" p={1} alignItems="center">
        <Box ml={1}>
          <NextLink href='/'>
            <IconButton color="secondary">
              <AiFillHome />
            </IconButton>
          </NextLink>
        </Box>
        <Box display="flex" flexGrow={!md ? 1 : undefined} justifyContent="center" 
         mx={md ? 2.5 : undefined} width={lg ? "30vw" : "20vw"}
        >
          <NextLink href="/watchlist" passHref>
            <Link underline="none">
              <Typography variant="overline">
                Watchlist
              </Typography>
            </Link>
          </NextLink>
        </Box>
        {md && (
          <Box zIndex="modal" mb={2} mr={lg ? 5 : 2} width={lg ? "50vw" : "45vw"} position="relative">
            <SearchBar />
            <Box position="absolute" mt={3.1} ml={2}>
              <SearchedMovies />
            </Box>
          </Box>
        )}
        {!loading && (
          <Box width="30vw" display="flex" justifyContent="center">
            {user && (
              <motion.div initial={{ y : -150 }} animate={{ y : 0 }} onClick={handleLogoutClick}>
                {md ? (
                  <Button variant="outlined" color="secondary" size="small">
                   Logout
                  </Button>
                ) : (
                  <IconButton color="secondary">
                    <BsFillPersonCheckFill />
                  </IconButton>
                )} 
              </motion.div> 
            )}
            {!user && (
            <motion.div initial={{ y : -150 }} animate={{ y : 0 }}>
              {md ? (
                <Box display="flex">
                  <Box mr={2}>
                    <Button variant="outlined" color="secondary" size="small" 
                     onClick={() => dialogDispatch(setLogIn())}
                    >
                      Login
                    </Button>
                  </Box>     
                  <Button variant="outlined" color="secondary" size="small"
                   onClick={() => dialogDispatch(setSignUp())}
                  >
                    Sign Up
                  </Button>
                </Box>
              ) : (
                <IconButton color="secondary" onClick={() => dialogDispatch(setSignUp())}>
                  <BsFillPersonDashFill />
                </IconButton>
              )}  
            </motion.div>
            )}
          </Box>
        )}
      </Box>
    </nav>
  )
};

export default Navbar;
