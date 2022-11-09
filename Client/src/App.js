import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from "react-router-dom";
import Login from './components/login/Login';
import Home from './components/home/Home';
import PressRelease from './components/pressrelease/PressRelease';
import GuestPost from './components/guestpost/GuestPost';
import Categories from './components/categories/Categories';
import EditPost from './components/EditPost';
import PostUploading from './components/PostUploading';
import "./app.css"
import ViewPost from './components/Viewpost';
import Contact from './components/contactComponet/contact';

export default function App() {
  return (
    <Routes>
      {/* <Route path='/' element={<Login />} /> */}
      <Route path='/' element={<Home />} />
      <Route path='/home' element={<Home />} />
      <Route path='/press-release' element={<PressRelease />} />
      <Route path='/guest-post' element={<GuestPost />} />
      <Route path='/categories' element={<Categories />} />
      <Route path='/edit-post/:type/:postid' element={<EditPost />} />
      <Route path='/upload-post/:type' element={<PostUploading />} />
      <Route path='/view-press-release/:postid' element={<ViewPost />} />
      <Route path='/view-guest-post/:gpostid' element={<ViewPost />} />
      <Route path='*' element={<h1>404</h1>} />
    </Routes>
  );
}