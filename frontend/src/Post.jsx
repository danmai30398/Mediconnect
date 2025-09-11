import React from "react";
import { useParams, Link } from "react-router-dom";
import { posts } from "./data/data.js";

function Post() {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);

  if (!post) return <div className="auth-wrap"><div className="auth-card">Post not found.</div></div>;

  return (
    <div className="section" style={{background:"#fff"}}>
      <div className="container" style={{maxWidth:900}}>
        <img src={post.image} alt={post.title} style={{width:"100%", borderRadius:10}} />
        <h1 style={{marginTop:18}}>{post.title}</h1>
        <div style={{color:"#6b6f72"}}>📅 {post.date} · {post.author}</div>
        <p style={{marginTop:14, lineHeight:1.7}}>{post.content}</p>
        <Link to={`/categories/${post.category}`} className="btn btn-primary">← Back to category</Link>
      </div>
    </div>
  );
}

export default Post;