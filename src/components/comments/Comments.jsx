import { useContext, useState } from 'react';
import './comments.scss';
import { authContext } from '../../context/authContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';

const Comments = ({ id }) => {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(authContext);
  const [comment, setComments] = useState({
    desc: '',
    postId: id,
  });

  const handleInputs = (e) => {
    setComments((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  //Temporary

  const { isLoading, error, data } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/comments/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      return await axios.post(
        'http://localhost:8000/comments/add',
        newComment,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      setComments((pre) => ({ ...pre, desc: '' }));
    },
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;
  console.log('data', data);

  return (
    <div className='comments'>
      <div className='write'>
        <img src={currentUser.img} alt='' />
        <input
          type='text'
          placeholder='write a comment'
          name='desc'
          value={comment.desc}
          onChange={handleInputs}
        />
        <button
          onClick={() => {
            mutation.mutate(comment);
          }}
        >
          Send
        </button>
      </div>
      {data.map((comment) => (
        <div className='comment' key={comment.id}>
          <img src={comment.profile} alt='' />
          <div className='info'>
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className='date'>
            {moment(data.createdAT, 'MMMM Do YYYY, h:mm:ss a').fromNow()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
