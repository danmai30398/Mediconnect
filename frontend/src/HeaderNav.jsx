import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import logo from "./assets/pic/logo.jpg";

const NAV_OFFSET = 70;

function HeaderNav({ defaultTab }) {
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
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setShowSearch(false);
    setQ("");
  };
  

  return (
    <header>
      {/* Logo */}
      <div className="header">
        <div className="container row">
          <Link to="/" className="brand-link">
            <img src={logo} alt="logo" className="brand-logo" />
            <div>
              <div className="brand-title">MediConnect Group</div>
              <div className="brand-subtitle">Your Health Care Assistant</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="container inner">
          {/* Menu links */}
          <div className="menu">
            <Link to="/home">HOME</Link>
            <a href="#about" onClick={(e) => scrollToId(e, "about")}>ABOUT</a>
            <a href="#services" onClick={(e) => scrollToId(e, "services")}>SERVICE</a>
            <a href="#experts" onClick={(e) => scrollToId(e, "experts")}>EXPERTS</a>
            <a href="#topics" onClick={(e) => scrollToId(e, "topics")}>TOPICS</a>
            <a href="#pages" onClick={(e) => scrollToId(e, "pages")}>CONTACT</a>
          </div>

          {/* Actions: CATEGORY + Search */}
          <div className="actions">
            {/* Dropdown Category */}
            <div className="dropdown category-dropdown">
              <button className="dropbtn">CATEGORY</button>
              <div className="dropdown-content">
                <Link to="/category/1">Diseases</Link>
                <Link to="/category/2">Preventions</Link>
                <Link to="/category/3">Cures</Link>
              </div>
            </div>

            {/* Search icon */}
            <button
              className="iconbtn"
              title="Search"
              onClick={() => setShowSearch((s) => !s)}
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Search form */}
        {showSearch && (
          <form className="searchBar" onSubmit={onSearch}>
            <FaSearch style={{ color: "#fff" }} />
            <input
              className="searchInput"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="closeBtn"
              type="button"
              onClick={() => setShowSearch(false)}
            >
              <FaTimes />
            </button>
          </form>
        )}
      </nav>
    </header>
  );
}

export default HeaderNav;
