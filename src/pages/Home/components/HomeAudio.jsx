import React from "react";

const HomeAudio = ({ audioRef }) => {
  return <audio ref={audioRef} src="/aud/backsound.mp3" loop />;
};

export default HomeAudio;
