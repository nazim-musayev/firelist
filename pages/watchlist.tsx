import { FC, useState, useEffect } from 'react';
import { Movie } from 'interfaces';
import { db } from 'utils/firebase';
import { onSnapshot, doc } from '@firebase/firestore';
import NextLink from 'next/link';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { useAuth } from 'context/Auth';
import Watchlist from 'components/cards/Watchlist';


const watchlist: FC = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const { user } = useAuth();

  useEffect(()=> {
    const unsubscribe = onSnapshot(doc(db, "users", `${user?.uid}`), (doc) => {
      const movies: Movie[] = doc.data()?.watchlist;
      setWatchlist(movies ? movies : []);
    });
    
    return () => unsubscribe();

  }, [user]);

  return (
    <div>
      {watchlist.length === 0 ? (
        <Box my={20}>
          <Typography variant="subtitle1" align="center" paragraph>
            {user ? (`Your watchlist is empty right now`) : (`Before making a watchlist firstly you have to login`) }
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph>
            See all movies in 
            <NextLink href="/" passHref>
              <Link underline="none" color="secondary">
                {`  HomePage`}
              </Link>
            </NextLink>
          </Typography>
          <Typography variant="subtitle1" align="center">
            Or search for specific one 
          </Typography>
       </Box>
      ) : (
        <Watchlist watchlist={watchlist} />
      )}
    </div>
  )
}

export default watchlist;
