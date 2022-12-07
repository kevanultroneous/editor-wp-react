import {
  Badge,
  Button,
  Col,
  Container,
  Image,
  Row,
  Table,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import "./style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import DeleteModel from "../common/DeleteModel";
import { defaultUrl, frontendurl } from "../../utils/default";
import { MdClose, MdDone, MdDoneAll, MdDrafts } from "react-icons/md";
import Pagination from "rc-pagination";
import { FcLeft, FcRight } from "react-icons/fc";
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const PressRelease = () => {
  const navigate = useNavigate();
  let query = useQuery();
  const [postData, setPostData] = useState([]);
  const [deleteShow, setDeleteShow] = useState(false);
  const [currentPost, setCurrentPost] = useState("");
  const [currentPostId, setCurrentPostId] = useState("");
  const handleDeleteShow = () => setDeleteShow(true);
  const handleDeleteHide = () => setDeleteShow(false);

  const handleDelete = (id, title) => {
    handleDeleteShow();
    setCurrentPostId(id);
    setCurrentPost(title);
  };

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

  const timestampToDate = (ts) => {
    return (
      new Date(ts).getDate() +
      "-" +
      (new Date(ts).getMonth() + 1) +
      "-" +
      new Date(ts).getFullYear()
    );
  };

  useEffect(() => {
    fetchPosts();
  }, [query]);

  const fetchPosts = () => {
    axios
      .post(`${defaultUrl}api/post/get-all-post`, {
        page: query.get("page"),
        limit: 30,
      })
      .then((r) => {
        if (r.data.success) {
          setPostData(r.data.data);
        }
      })
      .catch((e) => toast.error(e.response.data.msg));
  };
  const deletePosts = () => {
    axios
      .post(`${defaultUrl}api/post/delete-post`, { postid: currentPostId })
      .then((r) => {
        if (r.data.success) {
          handleDeleteHide();
          setCurrentPost("");
          setCurrentPostId("");
          fetchPosts();
        }
      })
      .catch((e) => toast.error(e.response.data.msg));
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <DeleteModel
        title={"Delete Press Release"}
        mentionText={`Are you sure to delete this ${currentPost} Press Release ?`}
        show={deleteShow}
        onHide={handleDeleteHide}
        handleYes={deletePosts}
        handleNo={handleDeleteHide}
      />
      <Container fluid>
        <Row className="AddActionSpace">
          <Col xl={12}>
            <Button
              variant="success"
              onClick={() => navigate("/upload-post/press-release")}
            >
              Add new PressRelease
            </Button>
          </Col>
        </Row>
        <Row className="TableSpace">
          <Col xl={12}>
            <Table striped bordered hover variant="dark">
              <thead style={{ position: "sticky", top: "0" }}>
                <tr>
                  <th>#</th>
                  <th>Cover/Featured</th>
                  <th>Title</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Released Date</th>
                  <th>Approved</th>
                  <th colSpan={3}>Action</th>
                </tr>
              </thead>
              <tbody>
                {postData != null ? (
                  postData[0]?.mainDoc.map((v, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <Image
                          src={`${defaultUrl + v.featuredImage}`}
                          height={80}
                          width={"100px"}
                        />
                      </td>
                      <td>
                        {v.paidStatus && (
                          <>
                            <Badge bg="success" pill>
                              Buzzed
                            </Badge>
                            <br />
                          </>
                        )}
                        {v.title}
                      </td>
                      <td>
                        <a
                          href={`${frontendurl}press-release/${v.slugUrl}`}
                          target={"_blank"}
                        >
                          visit
                        </a>
                      </td>
                      <td className="text-center">
                        <p>
                          {v.draftStatus == "published"
                            ? "Published"
                            : "Drafted"}
                        </p>
                      </td>

                      <td>{timestampToDate(v.releaseDate)}</td>
                      <td className={"text-center"}>
                        {v.isApproved ? (
                          <MdDone color="green" size={30} />
                        ) : (
                          <MdClose color="red" size={30} />
                        )}
                      </td>
                      {/* <td>
                        <Link to={`/view-press-release/${v._id}`}>
                          <Button variant="primary" style={{ width: "100%" }}>
                            View
                          </Button>
                        </Link>
                      </td> */}
                      <td>
                        <Button
                          variant="info"
                          style={{ width: "100%" }}
                          onClick={() =>
                            navigate(`/edit-post/press-release/${v._id}`)
                          }
                        >
                          Edit
                        </Button>
                      </td>
                      {v.isActive ? (
                        <td>
                          <Button
                            onClick={() => {
                              handleDelete(v._id, v.title);
                            }}
                            variant="danger"
                            style={{ width: "100%" }}
                          >
                            Delete
                          </Button>
                        </td>
                      ) : null}
                    </tr>
                  ))
                ) : (
                  <h1>No data</h1>
                )}
              </tbody>
            </Table>
          </Col>
          <Col xl={12} className={"pagination-fix"}>
            <Pagination
              showTitle={false}
              onChange={(v) => {
                navigate({
                  pathname: "/press-release",
                  search: `?page=${v}`,
                });
              }}
              current={parseInt(query.get("page")) || 1}
              pageSize={30}
              total={postData[0]?.totalCount}
              className="pagination-data"
              showTotal={(total, range) =>
                `Showing ${range[0]}-${range[1]} of ${postData[0]?.totalCount}`
              }
              itemRender={PrevNextArrow}
            />
          </Col>
        </Row>
        {console.log()}
      </Container>
    </>
  );
};
export default PressRelease;
