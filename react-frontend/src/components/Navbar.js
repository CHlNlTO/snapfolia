import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import snapfoliaLogo from "../assets/img/snapfolia_logo.png";
import faithLogo from "../assets/img/faith_logo.png";
import "../styles/Navbar.css";

function NavBar() {
  return (
    <Navbar expand="md" fixed="top" className="p-0" id="navbar_main">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src={snapfoliaLogo}
            className="m-2 mb-1 logo-size"
            alt="Snapfolia"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarOptions" className="navButton">
          <span className="fas fa-bars color-green"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarOptions" className="justify-content-center">
          <Nav className="fs-responsive navbar-options">
            <Nav.Link
              as={Link}
              to="/"
              className="ms-3 color-dgreen fw-bold nav-item"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/datasets"
              className="ms-3 color-dgreen fw-bold nav-item"
            >
              Datasets
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/developers"
              className="ms-3 color-dgreen fw-bold nav-item"
            >
              Developers
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand href="https://www.firstasia.edu.ph/" target="_blank">
          <img
            src={faithLogo}
            className="m-2 logo-size faith-logo"
            alt="FAITH Colleges"
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavBar;
