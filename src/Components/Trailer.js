import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { useLocation } from "react-router-dom";

const Trailer = () => {
  const location = useLocation();
  console.log(location);
  const {
    state: { videoId, movieTitle, movieOverview },
  } = location;
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });
  const opts = {
    height: (width * 5.5) / 16,
    width: width - 18,
    playerVars: {
      autoplay: 1,
    },
  };
  const handlePlayVideo = (event) => {
    event.target.pauseVideo();
  };
  return (
    <div className="trailer">
      <div className="youtube">
        <YouTube
          // videoId="tHb7WlgyaUc"
          videoId={videoId}
          role="button"
          opts={opts}
          onReady={handlePlayVideo}
        ></YouTube>
      </div>
      <div className="trailerInfo">
        <h1>{movieTitle}</h1>
        <p>{movieOverview}</p>
      </div>
    </div>
  );
};
export default Trailer;
