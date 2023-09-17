import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export const authContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user') || null)
  );
  const login = async (user) => {
    try {
      const res = await axios.post('http://localhost:8000/auth/login', user, {
        withCredentials: true,
      });
      if (res) {
        setCurrentUser(res.data);
        toast.success('Login Sucessful', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    } catch (error) {
      toast.error('something went wrong', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      console.log('error', error);
    }
  };
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  console.log('login', currentUser);
  return (
    <authContext.Provider value={{ login, currentUser }}>
      {children}
      <ToastContainer />
    </authContext.Provider>
  );
};
