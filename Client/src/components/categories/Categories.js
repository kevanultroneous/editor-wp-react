import { Button, Col, Container, Row, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import "./style.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { defaultUrl } from "../../utils/default";
import DeleteModel from "../common/DeleteModel";
import ModelUpdate from "../common/UpdateModel";
import ModelUpload from "../common/UploadCategoryModel";

export default function Categories() {
  useEffect(() => {
    fetchCategory();
  }, []);

  const [switches, setSwitches] = useState(false);
  const [switches2, setSwitches2] = useState(false);
  const [show, setShow] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [showUpd, setShowUpd] = useState(false);

  const [catname, setCatname] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);

  const [currentCatId, setCurrentCatId] = useState("");
  const [currentCatname, setCurrentCatname] = useState("");
  const [newcatname, setNewCatname] = useState("");

  const [categoryData, setCategoryData] = useState([]);

  const handleClose = () => {
    setSubCategories([]);
    setShow(false);
  };
  const handleCloseUpd = () => setShowUpd(false);

  const handleShow = () => setShow(true);
  const handleShowUpd = () => setShowUpd(true);

  const handleSave = () => {
    let parentid = currentCatId;
    if (switches2) {
      if (parentid === "" || parentid === null) {
        alert("select the category !");
      } else {
        axios
          .post(`${defaultUrl}api/category/create-category`, {
            parentCategory: parentid,
            title: catname,
            postType: switches === true ? "press" : "blog",
          })
          .then((r) => {
            if (r.data.success) {
              toast.success(r.data.msg);
              handleClose();
              fetchCategory();
              setCatname("");
              setCurrentCatId("");
            } else {
              toast.error(r.data.msg);
            }
          })
          .catch((e) => toast.error(e.response.data.msg));
      }
    } else {
      if (catname.length <= 3) {
        alert("category name is required !");
      } else {
        axios
          .post(`${defaultUrl}api/category/create-category`, {
            title: catname,
            postType: switches ? "press" : "blog",
          })
          .then((r) => {
            if (r.status === 200) {
              toast.success(r.data.msg);
              handleClose();
              fetchCategory();
              setCatname("");
              setSwitches(false);
            } else {
              toast.error(r.data.msg);
            }
          })
          .catch((e) => toast.error(e.response.data.msg));
      }
    }
  };

  const fetchCategory = () => {
    axios
      .get(`${defaultUrl}api/category/all-category`)
      .then((r) => {
        if (r.data.status === 200) {
          // console.log(r.data);
          setCategoryData(r.data.data);
        }
      })
      .catch((e) => toast.error(e.response.data.msg));
  };

  const deleteCategory = (catid) => {
    axios
      .post(`${defaultUrl}api/category/delete-category`, { categoryId: catid })
      .then((r) => {
        if (r.data.status === 200) {
          toast.success(r.data.msg);
          setSmShow(false);
          setCurrentCatId("");
          setCurrentCatname("");
          fetchCategory();
        }
      })
      .catch((e) => toast.error(e.response.data.msg));
  };

  const handleUpdate = () => {
    axios
      .post(`${defaultUrl}api/category/update-category`, {
        categoryId: currentCatId,
        title: newcatname,
        postType: switches ? "press" : "blog",
      })
      .then((r) => {
        toast.success("Category updated !");
        fetchCategory();
        setCurrentCatId("");
        setCurrentCatname("");
        handleCloseUpd();
      })
      .catch((e) => toast.error(e.response.data.msg));
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <Container fluid>
        <Row className="AddActionSpace">
          <Col xl={12}>
            <Button variant="success" onClick={handleShow}>
              Add Category / Subcategory
            </Button>
          </Col>
        </Row>
        {!(categoryData.length === 0) ? (
          <Row className="TableSpace">
            <Col xl={6}>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th className="text-center">Sr.no</th>
                    <th>Category</th>
                    <th className="text-center">Global Type</th>
                    <th colSpan={3} className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData?.map((v, i) => (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td>{v.title}</td>
                      <td className="text-center">{v.postType}</td>
                      <td>
                        <Button
                          variant="info"
                          style={{ width: "100%" }}
                          onClick={() => {
                            handleShowUpd();
                            setCurrentCatId(v._id);
                            setCurrentCatname(v.title);
                            setNewCatname(v.title);
                            setSwitches(v.postType === "press" ? true : false);
                            setSelectedCategory(v.subcategories);
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          style={{ width: "100%" }}
                          onClick={() => {
                            setSmShow(true);
                            setCurrentCatname(v.title);
                            setCurrentCatId(v._id);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        ) : (
          <h1 className="text-center">No categories</h1>
        )}
      </Container>

      <DeleteModel
        show={smShow}
        onHide={() => setSmShow(false)}
        title={" Delete Category"}
        mentionText={`Are you sure to delete ${currentCatname} category ?`}
        handleYes={() => deleteCategory(currentCatId)}
        handleNo={() => {
          setSmShow(false);
          setCurrentCatId("");
          setCurrentCatname("");
        }}
      />
      <ModelUpdate
        catname={newcatname}
        changeCatname={(e) => setNewCatname(e.target.value)}
        show={showUpd}
        currentTitle={currentCatname}
        handleClose={handleCloseUpd}
        handleUpdate={handleUpdate}
        switches={switches}
        changeswitch={(e) => setSwitches(!switches)}
        selectedSubcategories={
          <div>
            <Row className="TableSpace">
              <Col xl={12}>
                {selectedCategory?.length <= 0 || selectedCategory === null ? (
                  <h2>No subcategories</h2>
                ) : (
                  <>
                    <h4>Subcategories</h4>
                    <Table striped bordered hover variant="dark">
                      <thead>
                        <tr>
                          <th className="text-center">Sr.no</th>
                          <th>
                            Sub Category
                            {selectedCategory.length === 0 ? "Blank" : "No"}
                          </th>
                          <th className="text-center">Global Type</th>
                          <th colSpan={3} className="text-center">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedCategory?.map((v, i) => (
                          <tr key={i}>
                            <td className="text-center">{i + 1}</td>
                            <td>{v.title}</td>
                            <td className="text-center">{v.postType}</td>
                            <td>
                              <Button
                                variant="info"
                                style={{ width: "100%" }}
                                onClick={() => {
                                  handleShowUpd();
                                  setCurrentCatId(v._id);
                                  setCurrentCatname(v.title);
                                  setNewCatname(v.title);
                                  setSwitches(
                                    v.postType === "press" ? true : false
                                  );
                                }}
                              >
                                Edit
                              </Button>
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                style={{ width: "100%" }}
                                onClick={() => {
                                  setSmShow(true);
                                  setCurrentCatname(v.title);
                                  setCurrentCatId(v._id);
                                }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                )}
              </Col>
            </Row>
          </div>
        }
      />
      <ModelUpload
        handleparentcategory={(e) => {
          setCurrentCatId(e.target.value);
        }}
        catname={catname}
        changeCatname={(e) => setCatname(e.target.value)}
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
        switches={switches}
        chnageswitch={(e) => {
          e.target.checked ? setSwitches(true) : setSwitches(false);
        }}
        switchessubcategory={switches2}
        chnageswitchsubcategory={(e) => {
          e.target.checked ? setSwitches2(true) : setSwitches2(false);
        }}
        keydown={(e) => {
          if (e.key === "Enter") {
            if (subCategories.includes(catname)) {
              alert("category you have already added !");
            } else {
              if (catname === "" || catname.length <= 3) {
                alert(
                  "enter valid category name ,category length required 4 letter !"
                );
              } else {
                setSubCategories(subCategories.concat(catname));
                setCatname("");
              }
            }
          }
        }}
        selectedSubcategories={
          subCategories.length > 0 && (
            <div className="SubCategoryWrraper">
              {subCategories.map((v, i) => (
                <div
                  className="SubCatTag"
                  onClick={() =>
                    setSubCategories(subCategories.filter((k) => k !== v))
                  }
                >
                  {v}
                </div>
              ))}
            </div>
          )
        }
        data={categoryData}
      />
    </>
  );
}
