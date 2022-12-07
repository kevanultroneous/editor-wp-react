import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigation = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand
          onClick={() => navigation("/home")}
          style={{ cursor: "pointer" }}
        >
          UNMediaBuzz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link onClick={() => navigation("/press-release")}>
              Press Release
            </Nav.Link>
            {/* <Nav.Link onClick={() => navigation('/guest-post')}>Guest Post</Nav.Link> */}
            <Nav.Link onClick={() => navigation("/categories")}>
              Categories
            </Nav.Link>
            <Nav.Link onClick={() => navigation("/inquires")}>
              Inquires
            </Nav.Link>
            {/* <Nav.Link onClick={() => navigation("/premium")}>
              Premium Plans
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
