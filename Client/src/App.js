import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import PressRelease from "./components/pressrelease/PressRelease";
import Categories from "./components/categories/Categories";
import EditPost from "./components/EditPost";
import PostUploading from "./components/PostUploading";
import "./app.css";
import "./rc-paginate.css";
import "react-image-crop/dist/ReactCrop.css";
import ViewPost from "./components/Viewpost";
import Premium from "./components/Premium";
import Inquires from "./components/inquires";
import Login from "./components/login/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/press-release" element={<PressRelease />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/edit-post/:type/:postid" element={<EditPost />} />
      <Route path="/upload-post/:type" element={<PostUploading />} />
      <Route path="/view-press-release/:postid" element={<ViewPost />} />
      <Route path="/inquires" element={<Inquires />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}
