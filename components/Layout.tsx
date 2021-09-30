import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { FC } from 'react';
import { Node } from 'interfaces';
import Meta from "./Meta";
import Navbar from './Navbar';
import SearchBar from './SearchBar';
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
  const sm = useMediaQuery('(max-width:766px)');
  const { searchWord } = useSearchState();
  const classes = useStyles();

  return (
    <div>
      <Meta />
      <Navbar />
      <Divider />
      <Login />
      <SignUp />
      {sm && <SearchBar />}
      <div className={sm ? undefined : (searchWord ? classes.children : undefined)}>
        {children}
      </div>
      <ScrollBack showBelow={250}/>
      <SnackBar />
      <Footer />
    </div>
  )
}

export default Layout;
