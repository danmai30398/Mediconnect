import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaShoppingBag } from "react-icons/fa";
import logo from './assets/pic/logo.png';

const NAV_OFFSET = 56; // chiều cao navbar

function HeaderNav() {
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const scrollToId = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    // tuỳ ý: điều hướng đến trang category search
    navigate(`/categories/${q.trim().toLowerCase()}`);
    setShowSearch(false);
  };

  return (
    <header>
      <div className="header">
        <div className="container row">
          <Link to="/" className="brand-link">
            <img src={logo} alt="logo" className="brand-logo" />
            <div>
              <div className="brand-title">eHospital</div>
              <div className="brand-subtitle">Your Health Care Assistant</div>
            </div>
          </Link>
        </div>
      </div>

      <nav className="navbar">
        <div className="container inner">
          <div className="menu">
            <Link to="/home">HOME</Link>
            <a href="#about" onClick={(e)=>scrollToId(e,"about")}>ABOUT</a>
            <a href="#services" onClick={(e)=>scrollToId(e,"services")}>SERVICE</a>
            <a href="#experts" onClick={(e)=>scrollToId(e,"experts")}>EXPERTS</a>
            <a href="#topics" onClick={(e)=>scrollToId(e,"topics")}>TOPICS</a>
            <a href="#pages" onClick={(e)=>scrollToId(e,"pages")}>PAGES</a>
          </div>

          <div className="actions">
            <button className="iconbtn" title="Cart"><FaShoppingBag/></button>
            <button className="iconbtn" title="Search" onClick={()=>setShowSearch(s=>!s)}><FaSearch/></button>
          </div>
        </div>

        {showSearch && (
          <form className="searchBar" onSubmit={onSearch}>
            <FaSearch style={{color:"#fff"}}/>
            <input
              className="searchInput"
              placeholder="Search"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
            />
            <button className="closeBtn" type="button" onClick={()=>setShowSearch(false)}>
              <FaTimes/>
            </button>
          </form>
        )}
      </nav>
    </header>
  );
}

export default HeaderNav;