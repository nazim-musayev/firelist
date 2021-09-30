import { ReactNode } from "react";

export interface Genre {
  name : string,
  id : number
};

export interface Movie { 
  id : number,
  title : string,
  poster_path : string,
  backdrop_path : string,
  release_date : string,
  vote_average : number,
  overview : string,
  genres : Genre[],
  original_language : string,
  vote_count : number
};

export interface MovieItem {
  movie : Movie
};

export interface Movies {
  movies : Movie[]
};

export interface Node {
  children? : ReactNode
};

export interface AuthInputs {
  email : string,
  password : string,
  username : string
};
