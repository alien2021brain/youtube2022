import './profile.scss';
import FacebookTwoToneIcon from '@mui/icons-material/FacebookTwoTone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Posts from '../../components/posts/Posts';
import { authContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { useContext, useState } from 'react';

const Profile = () => {
  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();
  const { currentUser } = useContext(authContext);
  console.log('currentUser', currentUser);
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/users/find/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const {
    isLoading: pending,
    error: error1,
    data: follower,
  } = useQuery({
    queryKey: ['follower', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/followers/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (currentUser) => {
      if (currentUser)
        return axios.delete(`http://localhost:8000/followers/unfollow/${id}`, {
          withCredentials: true,
        });
      return axios.post(`http://localhost:8000/followers/follow/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['follower'] });
    },
  });
  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;
  if (pending) return 'Loading...';

  if (error1) return 'An error has occurred: ' + error.message;

  const handleFollow = () => {
    mutation.mutate(follower.includes(currentUser.id));
  };

  return (
    <div className='profile'>
      <div className='images'>
        <img src={data[0].cover} alt='' className='cover' />
        <img src={data[0].img} alt='' className='profilePic' />
      </div>
      <div className='profileContainer'>
        <div className='uInfo'>
          <div className='left'>
            <a href='http://facebook.com'>
              <FacebookTwoToneIcon fontSize='large' />
            </a>
            <a href='http://facebook.com'>
              <InstagramIcon fontSize='large' />
            </a>
            <a href='http://facebook.com'>
              <TwitterIcon fontSize='large' />
            </a>
            <a href='http://facebook.com'>
              <LinkedInIcon fontSize='large' />
            </a>
            <a href='http://facebook.com'>
              <PinterestIcon fontSize='large' />
            </a>
          </div>
          <div className='center'>
            <span>{data[0].name}</span>
            <div className='info'>
              <div className='item'>
                <PlaceIcon />
                <span>{data[0].city}</span>
              </div>
              <div className='item'>
                <LanguageIcon />
              </div>
            </div>
            {currentUser.id == id ? (
              <button onClick={() => setModal(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {follower.includes(currentUser.id) ? 'following' : 'follow'}
              </button>
            )}
          </div>
          <div className='right'>
            <span>{data[0].email}</span>
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={data[0].userId} />
      </div>
      {modal && <Modal setModal={setModal} />}
    </div>
  );
};

export default Profile;
