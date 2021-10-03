import { FC, useState, useEffect } from 'react';
import { Movie } from 'interfaces';
import { db } from 'utils/firebase';
import { onSnapshot, doc } from '@firebase/firestore';
import NextLink from 'next/link';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useAuth } from 'context/Auth';
import WatchlistCard from 'components/cards/Watchlist';


const Watchlist: FC = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(()=> {
    const unsubscribe = onSnapshot(doc(db, "users", `${user?.uid}`), (doc) => {
      const movies: Movie[] = doc.data()?.watchlist;
      setWatchlist(movies ? movies : []);
      setLoading(false);
    });
    
    return () => unsubscribe();

  }, [user]);

  return (
    <div>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        watchlist.length === 0 ? (
          <Box my={20}>
            <Typography variant="subtitle1" align="center" paragraph>
              {user ? (`Your watchlist is empty right now`) : (`For making a watchlist you have to login`) }
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
          <WatchlistCard watchlist={watchlist} />
        )
      )}
    </div>
  )
}

export default Watchlist;
