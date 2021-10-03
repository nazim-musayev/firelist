import Typography  from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { useEffect, FC } from 'react';
import { useRouter } from 'next/router';
import Meta from 'components/Meta';
import { motion } from 'framer-motion';


const NotFound: FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
      <motion.div initial={{ y : 250 }} animate={{ y : 0 }}>
        <Meta title="Page is not found" />
        <Box my={20}>
          <Typography variant="h5" align="center" paragraph >
              Sorry
          </Typography>
          <Typography variant="body2" align="center" paragraph>
              Seems that page does not exist
          </Typography> 
          <Typography variant="body2" align="center" paragraph>
              Redirecting to <Link href="/" color="secondary" > Home Page</Link>...
          </Typography>
        </Box>
      </motion.div>
    )
};

export default NotFound;
