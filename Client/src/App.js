import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from "react-router-dom";
import Login from './components/login/Login';
import Home from './components/home/Home';
import PressRelease from './components/pressrelease/PressRelease';
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/press-release' element={<PressRelease />} />
      <Route path='/guest-post' element={<Home />} />
      <Route path='*' element={<h1>404</h1>} />
    </Routes>
  );
}