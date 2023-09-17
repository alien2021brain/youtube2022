import './share.scss';
import Image from '../../assets/img.png';
import Map from '../../assets/map.png';
import Friend from '../../assets/friend.png';
import { useContext, useState } from 'react';
import { authContext } from '../../context/authContext';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import axios from 'axios';

const Share = () => {
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState({
    desc: '',
    image: '',
  });

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return await axios.post('http://localhost:8000/posts/add', newPost, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // handling text Inputs
  const handleInputs = (e) => {
    setNewPost((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  // handlinging single images
  const handleImage = async (e) => {
    console.log('Image', e.target.files[0]);
    const file = new FormData();
    file.append('image', e.target.files[0]);
    try {
      const res = await axios.post('http://localhost:8000/uploads/post', file, {
        withCredentials: true,
      });
      if (res) {
        toast.success('Image Uploaded SucessFully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setNewPost((pre) => ({ ...pre, [e.target.name]: res.data }));
      } else {
        toast.error('image not uploaded', {
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
      toast.error('Network Error', {
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
  };

  // handle Submit
  const handleSubmit = (e) => {
    mutation.mutate(newPost);
  };
  console.log('SubmitImage', newPost);

  const { currentUser } = useContext(authContext);
  return (
    <div className='share'>
      <div className='container'>
        <div className='top'>
          <img src={currentUser.img} alt='' />
          <input
            type='text'
            placeholder={`What's on your mind ${currentUser.name}?`}
            onChange={handleInputs}
            name='desc'
          />
        </div>
        <hr />
        <div className='bottom'>
          <div className='left'>
            <input
              type='file'
              id='file'
              style={{ display: 'none' }}
              onChange={handleImage}
              accept='image/*'
              name='image'
            />
            <label htmlFor='file'>
              <div className='item'>
                <img src={Image} alt='' />
                <span>Add Image</span>
              </div>
            </label>
            <div className='item'>
              <img src={Map} alt='' />
              <span>Add Place</span>
            </div>
            <div className='item'>
              <img src={Friend} alt='' />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className='right'>
            <button onClick={handleSubmit}>Share</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Share;
