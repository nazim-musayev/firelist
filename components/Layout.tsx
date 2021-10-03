import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { FC } from 'react';
import { Node } from 'interfaces';
import Meta from "./Meta";
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import SearchedMovies from './SearchedMovies';
import Footer from './Footer';
import Login from './Login';
import SignUp from './SignUp';
import ScrollBack from './ScrollBack';
import SnackBar from './SnackBar';
import { useSearchState } from 'context/Search';

const useStyles = makeStyles(() =>
  createStyles({
   children : {
     filter: "opacity(25%)",
     pointerEvents : "none"
   }
  }),
);


const Layout : FC<Node> = ({children}) => {
  const classes = useStyles();
  const sm = useMediaQuery('(max-width:766px)');
  const { searchWord, searchedMovies } = useSearchState();
  const isSearching: boolean = sm && (searchWord ? true : false);

  return (
    <div>
      <Meta />
      <Navbar />
      <Divider />
      <Login />
      <SignUp />
      {sm && <SearchBar />}
      {isSearching && (
        <Box height={searchedMovies.length > 2 ? "auto" : "60vh"}>
          <SearchedMovies />
        </Box>
      )}
      {!isSearching && (
        <div className={sm ? undefined : (searchWord ? classes.children : undefined)}>
          {children}
        </div>
      )}
      <ScrollBack showBelow={250}/>
      <SnackBar />
      <Footer />
    </div>
  )
}

export default Layout;
