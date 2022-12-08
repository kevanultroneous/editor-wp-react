import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import Header from "./common/Header";
import { defaultUrl } from "../utils/default";
import { AiFillEye } from "react-icons/ai";
const Inquires = () => {
  const [inquires, setInquires] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchInquires();
  }, []);

  const searchInquires = () => {
    axios
      .post(defaultUrl + "api/contact/search-enquiry", {
        searchTerm: search,
      })
      .then((r) => setInquires(r.data?.data[0]?.mainDoc))
      .catch((e) => console.log(e));
  };
  const fetchInquires = () => {
    axios
      .get(defaultUrl + "api/contact/all-enquiry")
      .then((r) => setInquires(r.data?.data[0]?.mainDoc))
      .catch((e) => console.log(e));
  };
  return (
    <>
      <Header />
      <div className="p-4 w-25">
        <Form.Control
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              searchInquires();
            }
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            <th>Topic</th>
            <th>Message</th>
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
              <td>{items.topic}</td>
              <td>{items.message}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div></div>
    </>
  );
};
export default Inquires;
