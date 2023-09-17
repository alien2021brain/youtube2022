import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../../context/authContext';
import './login.scss';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const Navigate = useNavigate();
  const { login } = useContext(authContext);
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const handleChange = (e) => {
    setUser((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(user);
      Navigate('/');
    } catch (error) {
      console.log(error, 'erorr login');
    }
  };
  console.log('user: ', user);
  return (
    <div className='login'>
      <div className='card'>
        <div className='left'>
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <Link to='/register'>
            <button>Register</button>
          </Link>
        </div>
        <div className='right'>
          <h1>Login</h1>
          <form meathod='POST'>
            <input
              type='text'
              placeholder='Username'
              name='username'
              onChange={handleChange}
            />
            <input
              type='password'
              placeholder='Password'
              name='password'
              onChange={handleChange}
            />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
