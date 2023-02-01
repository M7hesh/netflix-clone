import React, { useEffect, useState } from "react";
import "./Home.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BiPlay } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

const API_KEY = process.env.REACT_APP_MOVIE_DB_API_KEY;
// React app supports reads environment variables that begin with REACT_APP and makes them available through process.env.
// 'https://api.themoviedb.org/3/movie/upcoming?api_key=<API_KEY>&language=en-US&page=1'
const URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";
const UPCOMING = "upcoming";
const NOW_PLAYING = "now_playing";
const POPULAR = "popular";
const TOP_RATED = "top_rated";

const Card = ({ img, movieId, movieTitle, movieOverview }) => {
  const navigate = useNavigate();
  const getMovieVideo = async () => {
    const {
      data: { results },
    } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    const videoId = results?.filter((obj) => obj.type === "Trailer")[0].key;
    //navigate to Trailer
    navigate("/trailer", { state: { videoId, movieTitle, movieOverview } });
  };
  return <img className="card" src={img} alt="" onClick={getMovieVideo} />;
};

const Row = ({ title, moviesArray = [] }) => (
  <div className="row">
    <h2>{title}</h2>
    <div>
      {moviesArray.map((item, index) => (
        <Card
          key={index}
          img={`${IMG_URL}/${item.poster_path}`}
          movieId={item.id}
          movieTitle={item.original_title}
          movieOverview={item.overview}
        />
      ))}
    </div>
  </div>
);

const Home = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [movieGenres, setmovieGenres] = useState([]);
  const [popularMoviePosterIndex, setPopularMoviePosterIndex] = useState([]);

  useEffect(() => {
    const fetchMovies = async ({ rowCategory, setState, setBannerFlag }) => {
      const {
        data: { results },
      } = await axios.get(`${URL}/movie/${rowCategory}?api_key=${API_KEY}`);
      setState(results);
      setBannerFlag &&
        setPopularMoviePosterIndex(Math.floor(Math.random() * results.length));
      // console.log(results[0]);
    };

    const getAllGenre = async () => {
      const {
        data: { genres },
      } = await axios.get(`${URL}/genre/movie/list?api_key=${API_KEY}`);
      setmovieGenres(genres);
    };

    fetchMovies({ rowCategory: UPCOMING, setState: setUpcomingMovies });
    fetchMovies({ rowCategory: NOW_PLAYING, setState: setNowPlayingMovies });
    fetchMovies({
      rowCategory: POPULAR,
      setState: setPopularMovies,
      setBannerFlag: true,
    });
    fetchMovies({ rowCategory: TOP_RATED, setState: setTopRatedMovies });
    getAllGenre();
  }, []);

  const truncate = (description, length) => {
    return description?.length > length
      ? description.substr(0, length - 1) + "..."
      : description;
  };

  return (
    <section className="home">
      <div
        className="banner"
        style={{
          backgroundImage: popularMovies[popularMoviePosterIndex]
            ? `url(${`${IMG_URL}/${popularMovies[popularMoviePosterIndex].poster_path}`})`
            : "black",
        }}
      >
        <div className="bannerContents">
          {popularMovies[0] && (
            <>
              <h1>{popularMovies[popularMoviePosterIndex].original_title}</h1>
              <p>{truncate(popularMovies[popularMoviePosterIndex].overview)}</p>
            </>
          )}
          <div>
            <button>
              <BiPlay /> Play
            </button>
            <button>
              My List <AiOutlinePlus />
            </button>
          </div>
        </div>
      </div>

      <Row title={"Upcoming"} moviesArray={upcomingMovies} />
      <Row title={"Now Playing"} moviesArray={nowPlayingMovies} />
      <Row title={"Popular"} moviesArray={popularMovies} />
      <Row title={"Top Rated"} moviesArray={topRatedMovies} />

      <div className="genreBox">
        {movieGenres.map((item) => (
          <Link key={item.id} to={`/genre/${item.id}`}>
            {item.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Home;
