import { createTheme } from '@material-ui/core/styles';

const backgroundColor: string = "#14161d";
const primaryColor: string = "#fff";
const secondaryColor : string = "#42e3d0";

const theme = createTheme({
  palette : {
    primary : {
       main : primaryColor
    },
    secondary : {
       main : secondaryColor
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 993,
      xl: 1120,
    },
  },
  overrides: {
    MuiPaper : {
      root : {
        backgroundColor,
        color : primaryColor
      }
    }, 
    MuiIconButton : {
      root : {
        padding : "5px"
      }
    },
    MuiTypography : {
      overline : {
        fontSize : "20px",
        fontWeight : "bold"
      },
      colorTextSecondary : {
        color : "blue"
      }
    },
    MuiButton : {
      outlined : {
        color : 'lightcoral',
        borderColor : 'lightcoral'
      },
      contained : {
        backgroundColor,
        color : primaryColor,
        "&:hover" : {
          backgroundColor,
          color : secondaryColor
        }
      },
      root : {
        borderRadius : "0 0 5px 5px"
      }
    },
    MuiDivider : {
      root : {
        backgroundColor : primaryColor
      }
    },
    MuiTableCell : {
      root : {
        borderBottom : `1px solid ${secondaryColor}`
      }
    },
    MuiAvatar : {
      colorDefault : {
        backgroundColor : secondaryColor,
        width : "40px!important",
        height : "40px!important"
      }
    },
    },
})

export default theme;
