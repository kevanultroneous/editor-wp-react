import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./common/Header";

const Premium = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("admin_auth_unmb_token")) {
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
