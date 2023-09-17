import { useQuery } from '@tanstack/react-query';
import Post from '../post/Post';
import './posts.scss';
import axios from 'axios';

const Posts = ({ userId }) => {
  //TEMPORARY

  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/posts?userId=${userId}`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });
  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  console.log('Success', data);

  return (
    <div className='posts'>
      {data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Posts;
