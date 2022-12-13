import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import Header from "./common/Header";
import { defaultUrl } from "../utils/default";
import Pagination from "rc-pagination";
import { FcLeft, FcRight } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useQuery } from "./pressrelease/PressRelease";

const Inquires = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  });
  let query = useQuery();
  const [inquires, setInquires] = useState([]);
  const [search, setSearch] = useState("");
  const [currentNumber, setCurrentNumber] = useState(null);
  const PrevNextArrow = (current, type, originalElement) => {
    if (type === "prev") {
      return (
        <button>
          <FcLeft size={20} />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button>
          <FcRight size={20} />
        </button>
      );
    }
    return originalElement;
  };

  useEffect(() => {
    searchInquires();
  }, []);

  useEffect(() => {
    searchInquires();
  }, [query.get("page")]);

  const searchInquires = () => {
    axios
      .post(defaultUrl + "api/contact/search-enquiry", {
        searchTerm: search,
        limit: 10,
        page: query.get("page") ? query.get("page") : 1,
      })
      .then((r) => setInquires(r.data?.data))
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Header />
      <div className="p-4 w-25">
        <Form.Control
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate("/inquires");
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
          {inquires[0]?.mainDoc.map((items, index) => (
            <tr>
              <td>{currentNumber + index}</td>
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
      {inquires[0]?.totalCount > 10 && (
        <div className={"pagination-fix"}>
          <Pagination
            showTitle={false}
            onChange={(v) => {
              navigate({
                pathname: "/inquires",
                search: `?page=${v}`,
              });
            }}
            current={parseInt(query.get("page")) || 1}
            pageSize={10}
            total={inquires[0]?.totalCount}
            className="pagination-data"
            showTotal={(total, range) => (
              <>
                {setCurrentNumber(range[0])}
                Showing {range[0]}-{range[1]} of {inquires[0]?.totalCount}
              </>
            )}
            itemRender={PrevNextArrow}
          />
        </div>
      )}
    </>
  );
};
export default Inquires;
