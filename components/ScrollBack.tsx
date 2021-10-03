import { useState, useEffect, FC } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { MdKeyboardArrowUp } from 'react-icons/md';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scroll: {
      zIndex: 2,
      position: 'fixed',
      bottom : '5vh',
      right : '3.5vw',
      background: "#d49c9c",
      color: 'black',
      "&:hover, &.Mui-focusVisible": {
        transition: '0.3s',
        color: theme.palette.secondary.main,
        backgroundColor: '#DCDCDC'
      }
    } 
  }),
);

interface Props {
  showBelow : number
};

const ScrollBack: FC<Props> = ({showBelow}) => {
  const [show, setShow] = useState<boolean>(showBelow ? false : true);
  const classes = useStyles();
 
  const handleScroll = () => {
    if (window.pageYOffset > showBelow) {
        if (!show) setShow(true)
    } else {
        if (show) setShow(false)
    }
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: `smooth` })
  };

  useEffect(() => {
    if (showBelow) {
      window.addEventListener(`scroll`, handleScroll)
      return () => window.removeEventListener(`scroll`, handleScroll)
    }
  });

  return (
    <>
      {show &&
        <IconButton onClick={handleClick} className={classes.scroll} component="span">
          <MdKeyboardArrowUp />
        </IconButton> 
      }
    </>
    )
};

export default ScrollBack;
