import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from '@material-ui/core/Link';
import { FC } from 'react';
import NextLink from 'next/link';
import Image from "next/image";
import { MovieItem } from "interfaces";
import { motion } from 'framer-motion';


const MovieGrid6: FC<MovieItem> = ({movie}) => {
  const { title, backdrop_path, release_date } = movie;

  return (
    <Grid item xs={6}>
      <NextLink href={`/movie/${title}`} passHref>
      <Link>
        <Box position="relative" overflow="hidden">
          <motion.div whileHover={{ scale : 1.05 }}>
            <Image src={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
             alt={title} width={150} height={100} layout="responsive" 
             placeholder="blur" blurDataURL={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
            />
          </motion.div>
          <Box position="absolute" bottom={5} left={8} width={200}>
            <Typography>
              {release_date.slice(0,4)}
            </Typography>
            <Typography variant="subtitle2">
              {title.slice(0, 25)}
            </Typography>
          </Box>
        </Box>
      </Link>
      </NextLink>
    </Grid>
  )
};

export default MovieGrid6;
