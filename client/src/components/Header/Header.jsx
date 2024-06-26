import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { SlMenu } from "react-icons/sl";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import aceflixLogo from "../../assets/images/aceflixLogo.png";
import DisplaySearchResults from "../DisplaySearchResults/DisplaySearchResults";

export default function Header({
  setIsOpen,
  setHomeActive,
  setMovieActive,
  setSerieActive,
}) {
  const [search, setSearch] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [display, setDisplay] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [closeMark, setCloseMark] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_API_KEY;
  const fetchResults = `https://api.themoviedb.org/3/search/multi?query=${inputValue}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleInput = (e) => {
    setInputValue(e.target.value);
    setCloseMark(true);
  };

  const handleDelete = () => {
    setInputValue("");
    setCloseMark(false);
  };

  const searchResult = () => {
    if (inputValue === "") return console.error(" Sorry no results ");

    fetch(fetchResults)
      .then((response) => response.json())
      .then((data) => setSearch(data.results))
      .catch((err) => console.error(err));

    setInputValue("");
    setDisplay(true);
    setCloseMark(false);
    return true;
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      searchResult();
    } else if (inputValue === "") {
      setCloseMark(false);
    }
  };

  const openNav = () => {
    setIsOpen(true);
    document.body.classList.add("active");
  };

  const navigateHome = () => {
    navigate("/");
    setHomeActive(true);
    setMovieActive(false);
    setSerieActive(false);
  };

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div id="Header">
        <div className="hearder-burger">
          <button
            aria-label="menu"
            className="burger-btn"
            type="button"
            onClick={openNav}
          >
            <SlMenu />
          </button>
        </div>

        <div
          className="aceflix-logo"
          onClick={navigateHome}
          role="presentation"
        >
          <img src={aceflixLogo} alt="Aceflix-Logo" />
        </div>

        <div className="main-search-input">
          <input
            className="header-input"
            type="text"
            aria-label="search"
            value={inputValue}
            onInput={handleInput}
            onKeyDown={handleSearchKey}
            placeholder="Search for movies, series & actors ..."
          />

          <button
            className="header-search-btn"
            type="button"
            onClick={searchResult}
          >
            {" "}
            <IoSearch />{" "}
          </button>
          {closeMark && (
            <IoMdClose
              className="delete-input"
              onClick={handleDelete}
              role="presentation"
            />
          )}
        </div>
      </div>

      {display && (
        <DisplaySearchResults
          results={search}
          inputValue={inputValue}
          setDisplay={setDisplay}
        />
      )}
    </motion.header>
  );
}

Header.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  setHomeActive: PropTypes.func.isRequired,
  setSerieActive: PropTypes.func.isRequired,
  setMovieActive: PropTypes.func.isRequired,
};
