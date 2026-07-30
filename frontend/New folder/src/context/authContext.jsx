import {useContext, createContext, useState, useEffect} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
      const [user,setUser] = useState(null);
      const [token, setToken] = useState(null);
      const [loading, setLoading] = useState(true);

      const login = (userData,token) => {
            setUser(userData);
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
      }
      const logout = () => {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
      }

      useEffect(() => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if(storedToken){
                  try {
                        if (storedUser) {
                              setUser(JSON.parse(storedUser));
                              setToken(storedToken);
                        } else {
                              const decoded = JSON.parse(atob(storedToken.split('.')[1]));
                              if (!decoded.name) {
                                    localStorage.removeItem('token');
                              } else {
                                    setUser(decoded);
                                    setToken(storedToken);
                              }
                        }
                  } catch (err) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                  }
            }
            setLoading(false);
      }, []);

      return (
            <AuthContext.Provider value={{user,login,logout,token,loading}}>
                  {children}
            </AuthContext.Provider>
      )
}
