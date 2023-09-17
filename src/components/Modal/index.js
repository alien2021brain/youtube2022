import React, { useState } from 'react';
import './Modal.css';
import axios from 'axios';
import { QueryClient, useMutation } from '@tanstack/react-query';
const queryClient = new QueryClient();

function Modal({ setModal }) {
  const [upadate, setUpadate] = useState({
    name: '',
    email: '',
    city: '',
    cover: '',
    img: '',
  });
  const handleText = (e) => {
    setUpadate((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };
  const handleImage = async (e) => {
    const formdata = new FormData();
    formdata.append('profile', e.target.files[0]);
    const res = await axios.post(
      'http://localhost:8000/uploads/single',
      formdata,
      {
        withCredentials: true,
      }
    );
    setUpadate((pre) => ({ ...pre, [e.target.name]: res.data }));
  };
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.put('http://localhost:8000/users', data, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setModal(false);
    },
  });
  const handleSubmit = () => {
    mutation.mutate(upadate);
  };
  console.log('userUpdate', upadate);
  return (
    <div className='modal'>
      <div className='wrapper'>
        <h1 className='cross' onClick={() => setModal(false)}>
          X
        </h1>
        <h1>Fill your Details</h1>
        <form className='form'>
          <div className='formcontrol'>
            <input
              type='text'
              placeholder='Enter New Name'
              name='name'
              onChange={handleText}
              autoComplete='none'
            />
          </div>
          <div className='formcontrol'>
            <input
              type='text'
              placeholder='Enter New Email'
              name='email'
              onChange={handleText}
              autoComplete='none'
            />
          </div>
          <div className='formcontrol'>
            <input
              type='text'
              placeholder='Enter New Country'
              name='city'
              onChange={handleText}
              autoComplete='none'
            />
          </div>
          <div>
            <h3>Choose Profile </h3>
            <div className='formcontrol'>
              <input
                type='file'
                accept='image/*'
                placeholder='Enter New Country'
                onChange={handleImage}
                name='img'
              />
            </div>
          </div>
          <div>
            <h3>Choose cover </h3>
            <div className='formcontrol'>
              <input
                type='file'
                accept='image/*'
                placeholder='Enter New Country'
                onChange={handleImage}
                name='cover'
              />
            </div>
          </div>
        </form>
        <div className='updateContainer'>
          <button className='update' onClick={handleSubmit}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
