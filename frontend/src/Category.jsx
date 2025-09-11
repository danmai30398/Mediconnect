import React from "react";
import { useParams, Link } from "react-router-dom";
import { posts, categories } from "./data/data.js";

function Category() {
  const { slug } = useParams();
  const cat = categories.find(c => c.slug === slug);
  const list = posts.filter(p => p.category === slug);

  if (!cat) return <div className="auth-wrap"><div className="auth-card">Category not found.</div></div>;

  return (
    <div className="section" style={{background:"#f6f8f9", minHeight:"60vh"}}>
      <div className="container">
        <h2 className="section-title">{cat.name}</h2>
        <div className="cards">
          {list.map(p=>(
            <article key={p.id} className="card">
              <img src={p.image} alt={p.title}/>
              <div className="body">
                <div className="meta">📅 {p.date}</div>
                <div className="title">{p.title}</div>
                <div className="meta">{p.author} · eHospital</div>
                <div style={{marginTop:10}}><Link to={`/post/${p.id}`} className="btn btn-primary">Read more</Link></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Category;