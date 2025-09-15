import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function Category() {
  const { id } = useParams(); // Get category_id from URL
  const [category, setCategory] = useState(null);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/categories/${id}/contents`)
      .then(res => {
        setCategory(res.data.category);
        setContents(res.data.contents);
      })
      .catch(err => console.error("Category not found", err));
  }, [id]);

  if (!category) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">Category not found.</div>
      </div>
    );
  }

  return (
    <div className="section" style={{ background: "#f6f8f9", minHeight: "60vh" }}>
      <div className="container">
        <h2 className="section-title">{category}</h2>
        <div className="cards">
          {contents.length === 0 ? (
            <p>No posts available in this category.</p>
          ) : (
            contents.map(p => (
              <Link
                to={`/post/${p.id}`}
                key={p.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article className="card" style={{ cursor: "pointer" }}>
                  <img
                    src={`http://localhost:8000/storage/${p.image}`} 
                    alt={p.title}
                  />
                  <div className="body">
                    {/* <div className="meta">📅 {p.date || "No date available"}</div> */}
                    <div className="title">{p.title}</div>
                    <p className="description">
                      {p.description?.slice(0, 100) || "No description"}...
                    </p>
                    <div className="meta"> MediConnect · By Admin</div>
                    {/* <div className="meta">{p.author || "Unknown author"} · eHospital</div> */}

                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
