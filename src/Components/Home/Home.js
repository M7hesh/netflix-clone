import React, { useEffect, useState } from "react";
import "./Home.scss";
import axios from "axios";

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
  useEffect(() => {
    const fetchUpcomingMovie = async () => {
      const {
        data: { results },
      } = await axios.get(`${URL}/movie/${UPCOMING}?api_key=${API_KEY}`);
      setUpcomingMovies(results);
    };
    fetchUpcomingMovie();
  }, []);

  return (
    <section className="home">
      <div className="banner"></div>
      <Row title={"Upcoming"} moviesArray={upcomingMovies} />
      <Row title={"Now Playing"} />
      <Row title={"Popular"} />
      <Row title={"Top Rated"} />
    </section>
  );
};

export default Home;
