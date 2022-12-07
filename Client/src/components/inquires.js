import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import Header from "./common/Header";
import { defaultUrl } from "../utils/default";
const Inquires = () => {
  const [inquires, setInquires] = useState([]);

  useEffect(() => {
    fetchInquires();
  }, []);
  const fetchInquires = () => {
    axios
      .get(defaultUrl + "api/contact/all-enquiry")
      .then((r) => setInquires(r.data?.data))
      .catch((e) => console.log(e));
  };
  return (
    <>
      <Header />
      <div className="p-4 w-25">
        <Form.Control
          placeholder="Search by name or contact or mail"
          className="p-0 ps-3 pe-3"
          size="lg"
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Mail</th>
            <th>Phone</th>
            <th>Post</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {inquires.map((items, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{items.name}</td>
              <td>{items.email}</td>
              <td>{items.contact}</td>
              <td>{items.postType}</td>
              <td>
                <Button variant="link" size="sm">
                  Link
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
export default Inquires;
