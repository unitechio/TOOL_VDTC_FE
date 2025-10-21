import React from "react";
import ReactLoading from "react-loading";

const Loading = () => {
  return (
    <>
      <div
        className="overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.0)",
          zIndex: 9998,
        }}
      ></div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      >
        <ReactLoading type={"spinningBubbles"} color={"#ec6504"} height={"150px"} width={"150px"} />
      </div>
    </>
  );
};

export default Loading;
