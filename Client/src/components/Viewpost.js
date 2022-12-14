import axios from "axios";
import { Markup } from "interweave";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { defaultUrl } from "../utils/default";
import Header from "./common/Header";

export default function ViewPost() {
  const { postid } = useParams();
  const [postData, setPostData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("admin_auth_unmb_token")) {
      navigate("/");
    }
  });
  const fetchParamPost = () => {
    axios
      .post(`${defaultUrl}api/post/get-all-post`, { postid: postid })
      .then((r) => {
        if (r.data.success) {
          if (r.data?.data === null) {
            navigate("/home");
          }
          setPostData(r.data.data);
        }
      })
      .catch((e) => {
        navigate("/home");
        toast.error(e.response.data.msg);
      });
  };
  useEffect(() => {
    fetchParamPost();
  }, []);

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <div className="mt-5">
        <Container>
          <div>
            <Markup content={postData?.content} />
          </div>
        </Container>
      </div>
    </div>
  );
}
