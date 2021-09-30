import { useReducer, useContext, createContext, Dispatch } from 'react';
import { Node } from 'interfaces';
import { FC } from 'react';


type StateType = {
  login : boolean,
  signup : boolean
};
  
const initialState = {
  login : false,
  signup : false
};

enum DialogActions {
  SET_LOG_IN = "SET_LOG_IN",
  SET_SIGN_UP = "SET_SIGN_UP",
  CLOSE_DIALOG = "CLOSE_DIALOG"
};

interface DialogAction {
  type : DialogActions
};

export const setLogIn = () => {
  return {
    type : DialogActions.SET_LOG_IN
  }
};

export const setSignUp = () => {
  return {
    type : DialogActions.SET_SIGN_UP
  }
};

export const closeDialog = () => {
  return {
     type : DialogActions.CLOSE_DIALOG
  }
};

const StateContext = createContext<StateType>(initialState);
const DispatchContext = createContext<Dispatch<DialogAction>>(Object);

const reducer = (state: StateType, {type} : DialogAction ) => {
  switch (type) {

    case DialogActions.SET_LOG_IN :
      return {
        ...state,
        login : true,
        signup : false
      }

    case DialogActions.SET_SIGN_UP :
      return {
        login : false,
        signup : true
      }

    case DialogActions.CLOSE_DIALOG :
      return {
        login : false,
        signup : false
      }

    default:
        return state
  }
};

export const DialogProvider : FC<Node> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
};

export const useDialogState = () => useContext(StateContext);
export const useDialogDispatch = () => useContext(DispatchContext);
