import { FC, ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { BiSearchAlt } from "react-icons/bi";
import { MdCancel } from 'react-icons/md';
import useSWR from 'swr';
import { Movie } from 'interfaces';
import { useSearchDispatch, useSearchState, searchMovie, clearInput } from 'context/Search';


const fetcher = (url: string) => fetch(url).then(res => res.json());

const SearchBar: FC = () => {
  const key = process.env.NEXT_PUBLIC_APP_TMDB_KEY;
  const { data } = useSWR(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&page=1`,fetcher);
  const dispatch = useSearchDispatch();
  const { searchWord } = useSearchState();   

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value;
    const searchedMovies: Movie[] = data.results.filter((movie: Movie) => 
          movie.title.toLowerCase().includes(searchWord.toLowerCase()));
    dispatch(searchMovie(searchedMovies, searchWord));
  };

  const handleClick = () => {
    dispatch(clearInput());
  };
    
    return (
      <Box display="flex" alignItems="center" bgcolor="primary.main" borderRadius={20} mx={2} mt={2}>
        <IconButton disabled>
          <BiSearchAlt />
        </IconButton>
        <InputBase placeholder="Search" fullWidth onChange={handleChange} value={searchWord} />
        {searchWord && (
          <IconButton onClick={handleClick}>
            <MdCancel />
          </IconButton>
        )}
      </Box>
    )
};

export default SearchBar;
