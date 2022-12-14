import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import "./login.css";
import toast, { Toaster } from "react-hot-toast";
import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import axios from "axios";
import { defaultUrl } from "../../utils/default";

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_auth_unmb_token")) {
      navigate("/home");
    }
  });

  const loginAction = () => {
    if (!validator.isEmail(userName)) {
      toast.error("Enter valid email !");
    } else if (password.length < 4 || password == null || password === "") {
      toast.error("Enter valid password !");
    } else {
      axios
        .post(`${defaultUrl}api/user/signin`, {
          email: userName,
          password: password,
        })
        .then((response) => {
          if (response.data.token) {
            localStorage.setItem("admin_auth_unmb_token", response.data.token);
            toast.success(response.data.msg);
            navigate("/home");
          }
        })
        .catch((e) => {
          if (e.response) {
            toast.error(e.response.data.message);
          }
        });
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <Toaster position="top-right" reverseOrder={false} />
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <CardGroup className="">
              <Card className="p-4 cardstyle">
                <Card.Body>
                  <Form>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <InputGroup className="mb-3">
                      <Form.Control
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        type="email"
                        placeholder="Email"
                        className="inputborder shadow-none"
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <Form.Control
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        className="inputborder shadow-none"
                      />
                    </InputGroup>
                    <Row className="mt-4">
                      <Col xs={12} xl={5} md={5} lg={5}>
                        <Button
                          color="primary"
                          className="px-4 loginbtn shadow-none"
                          onClick={loginAction}
                          type="button"
                        >
                          Login
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
