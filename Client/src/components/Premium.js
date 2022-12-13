import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./common/Header";

const Premium = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  });
  return (
    <>
      <Header />
    </>
  );
};

export default Premium;
