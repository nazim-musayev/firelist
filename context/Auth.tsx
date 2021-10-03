import { useContext, createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from 'utils/firebase';
import { Node } from 'interfaces';
import { FC } from 'react';


type StateType = {
  loading : boolean,
  user: User | null
};
  
const initialState : StateType = {
  loading : true,
  user: null
};

const AuthContext = createContext<StateType>(initialState);

export const AuthProvider : FC<Node> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => useContext(AuthContext);
