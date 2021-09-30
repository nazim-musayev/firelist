import { FC, useReducer, useContext, createContext, Dispatch } from 'react';
import { Movie, Node } from 'interfaces';


type StateType = {
  searchedMovies : Movie[],
  searchWord : string
};
  
const initialState = {
  searchedMovies : [],
  searchWord : ''
};

enum SearchActions {
  SEARCH_MOVIE = "SEARCH_MOVIE",
  CLEAR_INPUT = "CLEAR_INPUT"
};

interface SearchAction {
  type : SearchActions,
  payload? : {
    searchedMovies : Movie[],
    searchWord : string
  };
};

export const searchMovie = (searchedMovies: Movie[], searchWord: string) => {
  return {
    type : SearchActions.SEARCH_MOVIE,
    payload : { searchedMovies, searchWord }
  }
};

export const clearInput = () => {
  return {
    type : SearchActions.CLEAR_INPUT
  }
};

const StateContext = createContext<StateType>(initialState);
const DispatchContext = createContext<Dispatch<SearchAction>>(Object);

const reducer = (state: StateType, {type, payload}: SearchAction ) => {
  switch (type) {

    case 'SEARCH_MOVIE' :
      return {
        ...state,
        searchedMovies : payload!.searchedMovies,
        searchWord : payload!.searchWord,
      }

    case 'CLEAR_INPUT' :
      return {
        searchWord : '',
        searchedMovies : []
      }
      
    default:
      return state
  }
};

export const SearchProvider: FC<Node> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
};

export const useSearchState = () => useContext(StateContext);
export const useSearchDispatch = () => useContext(DispatchContext);
