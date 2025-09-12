import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/contents/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error("Không tìm thấy bài viết", err));
  }, [id]);

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <p><i>Catgory: {post.category?.category_name}</i></p>
      <img src={`http://localhost:8000/storage/${post.image}`} alt={post.title} />
      <p>{post.description}</p>
    </div>
  );
}

export default PostDetail;
