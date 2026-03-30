import React from "react";

import morning from "../assets/morning.png";
import responsibilities from "../assets/responsibilities.png";
import disconnected from "../assets/disconnected.png";
import sleep from "../assets/sleep.png";
import stress from "../assets/stress.png";
import connection from "../assets/connection.png";

const imageMap = {
  morning,
  responsibilities,
  disconnected,
  sleep,
  stress,
  connection,
};

export default function QuestionIllustration({ imageKey }) {
  return (
    <img
      src={imageMap[imageKey]}
      alt={imageKey}
      style={{
  width: "100%",
  height: "360px",
  objectFit: "cover",
  borderRadius: "24px",
  display: "block"
}}
      
    />
  );
}