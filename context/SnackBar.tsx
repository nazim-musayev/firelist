import { FC, useReducer, useContext, createContext, Dispatch } from 'react';
import { Node } from 'interfaces';
import { Color } from '@material-ui/lab';


type StateType = {
  open : boolean,
  type : Color | undefined ,
  message : string
};
  
const initialState = {
  open : false,
  type : undefined,
  message : ''
};

interface SnackBarAction {
  type : string,
  payload : {
    open : boolean,
    type : Color | undefined,
    message : string
  };
};

export const setSnackBar = (open : boolean, type : Color | undefined, message : string) => {
  return {
    type : "SET_SNACKBAR",
    payload : { open, type, message }
  }
};

const StateContext = createContext<StateType>(initialState);
const DispatchContext = createContext<Dispatch<SnackBarAction>>(Object);

const reducer = (state: StateType, {type, payload}: SnackBarAction ) => {
  switch (type) {

    case "SET_SNACKBAR" :
      return {
        ...state,
        open : payload.open,
        type : payload.type,
        message : payload.message
      }
      
    default:
      return state
  }
};

export const SnackBarProvider : FC<Node> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
};

export const useSnackBarState = () => useContext(StateContext);
export const useSnackBarDispatch = () => useContext(DispatchContext);
