import React, { useEffect, useState } from "react";
import "./Home.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import { BiPlay } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

const API_KEY = "d0705aca799d5e99f9033942f5433ec2";
// 'https://api.themoviedb.org/3/movie/upcoming?api_key=d0705aca799d5e99f9033942f5433ec2&language=en-US&page=1'
const URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";
const UPCOMING = "upcoming";
const NOW_PLAYING = "now_playing";
const POPULAR = "popular";
const TOP_RATED = "top_rated";

const Card = ({ img }) => {
  return <img className="card" src={img} alt="" />;
};

const Row = ({ title, moviesArray = [] }) => (
  <div className="row">
    <h2>{title}</h2>
    <div>
      {moviesArray.map((item, index) => (
        <Card key={index} img={`${IMG_URL}/${item.poster_path}`} />
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

  useEffect(() => {
    const fetchMovies = async ({ rowCategory, setState }) => {
      const {
        data: { results },
      } = await axios.get(`${URL}/movie/${rowCategory}?api_key=${API_KEY}`);
      setState(results);
    };

    const getAllGenre = async () => {
      const {
        data: { genres },
      } = await axios.get(`${URL}/genre/movie/list?api_key=${API_KEY}`);
      setmovieGenres(genres);
    };

    fetchMovies({ rowCategory: NOW_PLAYING, setState: setNowPlayingMovies });
    fetchMovies({ rowCategory: UPCOMING, setState: setUpcomingMovies });
    fetchMovies({ rowCategory: POPULAR, setState: setPopularMovies });
    fetchMovies({ rowCategory: TOP_RATED, setState: setTopRatedMovies });
    getAllGenre();
  }, []);

  return (
    <section className="home">
      <div
        className="banner"
        style={{
          backgroundImage: popularMovies[0]
            ? `url(${`${IMG_URL}/${popularMovies[0].poster_path}`})`
            : "black",
        }}
      >
        {popularMovies[0] && (
          <>
            <h1>{popularMovies[0].original_title}</h1>
            <p>{popularMovies[0].overview}</p>
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
