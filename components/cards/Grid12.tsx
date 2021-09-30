import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { MovieItem } from "interfaces";
import { FC } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';


const GridItem12: FC<MovieItem> = ({movie}) => {
  const { title, backdrop_path, poster_path, release_date } = movie;

  return (
    <Grid item xs={12}>
      <NextLink href={`/movie/${title}`} passHref>
      <Link>
        <Box position="relative" overflow="hidden">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Image src={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
             alt={title} width={150} height={75} layout="responsive" 
             placeholder="blur" blurDataURL={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
            />
          </motion.div>
          <Box position="absolute" zIndex={2} bottom={5} left={5} display="flex" 
           width="100%" height={80} justifyContent="flex-start"
          >
            <Image src={`https://image.tmdb.org/t/p/w500${poster_path}`} 
             alt={title} width={75}  height={75} placeholder="blur"
             blurDataURL={`https://image.tmdb.org/t/p/w500${poster_path}`} 
            />
            <Box display="flex" flexDirection="column" justifyContent="center" ml={2}>
              <Typography>
                {release_date.slice(0,4)}
              </Typography>
              <Typography variant="subtitle1">
                {title}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Link>
      </NextLink>
    </Grid>
  )
}

export default GridItem12;
