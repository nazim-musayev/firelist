import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { GrTwitter, GrInstagram } from 'react-icons/gr';
import { FaFacebookF } from 'react-icons/fa';
import NextLink from 'next/link';


interface IconObj {
    icon : JSX.Element,
    path : string
};

const Footer: React.FC = () => {

  const icons: IconObj[] = [
    {
        icon : <FaFacebookF />,
        path : "https://www.facebook.com/"
    },
    {
        icon : <GrTwitter />,
        path : "https://twitter.com/home"
    },
    {
        icon : <GrInstagram />,
        path : "https://www.instagram.com/"
    },
  ];

  return (
    <footer>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={2}>
        <Typography variant="overline">
          WatchList
        </Typography>
        <Box display="flex" justifyContent="space-between" width="35vw" my={5}>
        {icons.map( ({icon, path}) => (
          <IconButton key={path} color="secondary">
            <NextLink href={path}>
              <Link>
                {icon}  
              </Link>
            </NextLink>
          </IconButton>
        ))}
      </Box>
    </Box>
    </footer>
  )
};

export default Footer;
