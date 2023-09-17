import './post.scss';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';
import Comments from '../comments/Comments';
import { useState } from 'react';
import axios from 'axios';
import {
  Mutation,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import moment from 'moment';
import { authContext } from '../../context/authContext.js';
import { useContext } from 'react';

const Post = ({ post }) => {
  const { currentUser } = useContext(authContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const queryClient = useQueryClient();

  //TEMPORARY
  const liked = true;
  console.log('post ', post.id);

  const { isLoading, error, data } = useQuery({
    queryKey: [post.id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/likes/${post.id}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });
  const mutation = useMutation({
    mutationFn: (Like) => {
      if (Like) {
        return axios.delete(`http://localhost:8000/likes/delete/${post.id}`, {
          withCredentials: true,
        });
      }

      return axios.post(
        'http://localhost:8000/likes/add',
        { postId: post.id },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [post.id] });
    },
  });

  const handleLikes = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;
  console.log(data, 'likes');
  return (
    <div className='post'>
      <div className='container'>
        <div className='user'>
          <div className='userInfo'>
            <img src={post.profile} alt='' />
            <div className='details'>
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className='name'>{post.name}</span>
              </Link>
              <span className='date'>
                {moment(post.createdAT, 'MMMM Do YYYY, h:mm:ss a').fromNow()}
              </span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className='content'>
          <p>{post.desc}</p>
          <img src={post.img} alt='' />
        </div>
        <div className='info'>
          <div className='item' onClick={handleLikes}>
            {data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon style={{ color: 'red' }} />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            {data.length} Likes
          </div>
          <div className='item' onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className='item'>
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments id={post.id} />}
      </div>
    </div>
  );
};

export default Post;
