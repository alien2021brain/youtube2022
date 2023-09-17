import { Link } from 'react-router-dom';
import './register.scss';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    img: '',
  });
  const handleUser = (e) => {
    setUser((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };
  const handleFile = async (e) => {
    const form = new FormData();
    form.append('profile', e.target.files[0]);

    try {
      const res = await axios.post(
        'http://localhost:8000/uploads/single',
        form,
        {
          withCredentials: true,
        }
      );
      if (res) {
        setUser((pre) => ({ ...pre, [e.target.name]: res.data }));
        toast.success('image uploaded sucessfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        toast.error('something went wrong ', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    } catch (error) {
      toast.error('network error ', {
        position: 'top-right',
        autoClose: 2000,
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
  const url = 'http://localhost:8000/auth/register';
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(url, user);
      res
        ? toast.success('data added sucessfully', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
        : toast.error('something went wrong', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
    } catch (error) {
      toast.error(error.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      console.log(error);
    }
  };
  console.log('user: ', user);
  return (
    <div className='register'>
      <div className='card'>
        <div className='left'>
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to='/login'>
            <button>Login</button>
          </Link>
        </div>
        <div className='right'>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Username'
              name='username'
              onChange={handleUser}
              autoComplete='none'
            />
            <input
              type='email'
              placeholder='Email'
              name='email'
              onChange={handleUser}
              autoComplete='none'
            />
            <input
              type='password'
              placeholder='Password'
              name='password'
              onChange={handleUser}
              autoComplete='none'
            />
            <input
              type='text'
              placeholder='Name'
              name='name'
              onChange={handleUser}
              autoComplete='none'
            />
            <input
              type='file'
              name='img'
              onChange={handleFile}
              accept='image/*'
            />
            <button type='submit'>Register</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
