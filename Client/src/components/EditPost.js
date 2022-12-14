import React, { useEffect, useRef, useState } from "react";
import Header from "./common/Header";
import {
  Container,
  Row,
  Col,
  Form,
  FloatingLabel,
  Button,
  Spinner,
  Badge,
  Image,
  Modal,
} from "react-bootstrap";
import "./postUploading.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Markup } from "interweave";
import { useNavigate, useParams } from "react-router-dom";
import ModelUpload from "./common/UploadCategoryModel";
import { IoMdAddCircle } from "react-icons/io";
import { defaultUrl } from "../utils/default";
import { useDebounceEffect } from "./cropimage/useDebounceEffect";
import { canvasPreview } from "./cropimage/canvasPreview";
import { imgPreview } from "./cropimage/imagePreview";
import ReactCrop from "react-image-crop";

export default function EditPost() {
  const { type, postid } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  });
  const [crop, setCrop] = useState({
    unit: "px", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 815,
    height: 570,
  });
  const previewCanvasRef = useRef(null);
  const [aspect, setAspect] = useState(16 / 9);
  const [completedCrop, setCompletedCrop] = useState();
  const [imageEditing, setImageEditing] = useState(false);
  const imgRef = useRef(null);
  const [prImg, setPrImg] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [ffile, setFFile] = useState(null);
  const [mainTitle, setMainTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [seotitle, setSeoTitle] = useState("");
  const [seodescription, setSeoDescription] = useState("");
  const [url, setUrl] = useState(mainTitle);
  const [publish, setPublish] = useState(0);
  const [content, setContent] = useState("");
  const [homePin, setHomePin] = useState(false);
  const [paid, setPaid] = useState(false);
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [approved, setApproved] = useState(false);
  const [weburl, setWeburl] = useState("");
  const [dummyImg, setDummyImg] = useState("");
  const [seokeywords, setSeokeywords] = useState("");
  const [paidprice, setPaidPrice] = useState("");
  //search category
  const [searchCateg, setSearchCateg] = useState([]);
  const [searchText, setSerachText] = useState("");
  const [suggestion, setSuggestion] = useState(false);
  const [loader, setLoader] = useState(false);
  const timestampToDate = (timestamp) => {
    // 2018-06-12T19:30
    return (
      new Date(timestamp).getFullYear() +
      "-" +
      (new Date(timestamp).getMonth() + 1 < 10
        ? "0" + new Date(timestamp).getMonth() + 1
        : new Date(timestamp).getMonth() + 1) +
      "-" +
      (new Date(timestamp).getDate() < 10
        ? "0" + new Date(timestamp).getDate()
        : new Date(timestamp).getDate()) +
      "T" +
      (new Date(timestamp).getHours() < 10
        ? "0" + new Date(timestamp).getHours()
        : new Date(timestamp).getHours()) +
      ":" +
      (new Date(timestamp).getMinutes() < 10
        ? "0" + new Date(timestamp).getMinutes()
        : new Date(timestamp).getMinutes())
    );
  };

  const fetchParamPost = () => {
    axios
      .post(
        `${defaultUrl}api/post/get-all-post`,
        { postid: postid },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((r) => {
        if (r.data?.success) {
          setAuthor(r.data?.data?.author);
          setMainTitle(r.data?.data?.title);
          setSeoTitle(r.data?.data?.seoTitle);
          setSeoDescription(r.data?.data?.seoDescription);
          setSummary(r.data?.data?.summary);
          setContent(r.data?.data?.content);
          setUrl(r.data?.data?.slugUrl);
          setWeburl(r.data?.data?.backlinkUrl);
          setPublish(r.data?.data?.draftStatus);
          setSelectedCategory(r.data?.data?.category);
          setSelectedSubCategory(r.data?.data?.subCategory);
          setCompany(r.data?.data?.companyName);
          setReleaseDate(r.data?.data?.releaseDate);
          setHomePin(r.data?.data?.homePageStatus);
          setDummyImg(
            r.data?.data?.featuredImage
              ? defaultUrl + r.data?.data?.featuredImage
              : null
          );
          setApproved(r.data?.data?.isApproved);
          setSeokeywords(r.data?.data?.seoKeywords);
          setPaid(r.data?.data?.paidStatus);
          setPaidPrice(r.data?.data?.totalPaidAmount);
        }
      })
      .catch((e) => {
        if (e.response.status === 500) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  };

  // * for emergency url edit
  // useEffect(() => {
  //   if (url.length > 0) {
  //     editUrl(url);
  //   }
  // }, [url]);

  // category upload
  const [show, setShow] = useState(false);
  const [catname, setCatname] = useState("");
  const handleClose = () => setShow(false);
  const handleSave = (catname) => {
    axios
      .post(
        `${defaultUrl}api/category/upload-category`,
        {
          title: catname,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((r) => {
        if (r.data.success) {
          toast.success(r.data.msg);
          handleClose();
          setCatname("");
        } else {
          toast.error(r.data.msg);
        }
      })
      .catch((e) => {
        if (e.response.status === 500) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  };

  const formdata = new FormData();

  formdata.append("title", mainTitle);
  formdata.append("summary", summary);
  selectedCategory.map((v, i) => formdata.append(`category[${i}]`, v));
  selectedSubCategory.map((v, i) => formdata.append(`subCategory[${i}]`, v));
  formdata.append("content", content);
  formdata.append("image", prImg);
  formdata.append("author", author);
  formdata.append("companyName", company);
  formdata.append("seoTitle", seotitle);
  formdata.append("seoDescription", seodescription);
  formdata.append("backlinkUrl", weburl);
  // formdata.append("slugUrl", url);
  formdata.append("draftStatus", publish);
  formdata.append("postType", "press");
  formdata.append("releaseDate", new Date(releaseDate));
  formdata.append("submitDate", new Date());
  formdata.append("paidStatus", paid);
  formdata.append("totalPaidAmount", paidprice);
  formdata.append("homePageStatus", homePin);
  formdata.append("isApproved", approved);
  formdata.append("seoKeywords", seokeywords);
  formdata.append("postid", postid);

  const postUpload = () => {
    if (mainTitle === "") {
      toast.error("Title is required !");
    } else if (selectedCategory.length <= 0) {
      toast.error("Please select one or more category !");
    } else if (content.length < 100) {
      toast.error("Content required 100 words !");
    } else {
      axios
        .post(`${defaultUrl}api/post/update-post`, formdata, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((r) => {
          if (r.data.success) {
            toast.success(r.data.msg);
            navigate(
              type === "press-release" ? "/press-release" : "/guest-post"
            );
          } else {
            toast.error(r.data.msg);
          }
        })
        .catch((e) => {
          if (e.response.status === 500) {
            localStorage.removeItem("token");
            navigate("/");
          }
        });
      setFFile(null);
    }
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);

        imgPreview(imgRef.current, completedCrop).then((r) => setPrImg(r));
      }
    },
    100,
    [completedCrop]
  );

  useEffect(() => {
    searchCategories(searchText);
    fetchParamPost();
  }, []);

  const searchCategories = (search) => {
    setLoader(true);
    setTimeout(() => {
      axios
        .post(
          `${defaultUrl}api/category/search-category`,
          { search },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((r) => {
          setLoader(false);
          setSearchCateg(r.data?.data);
          setSuggestion(r.data?.suggestion);
        })
        .catch((e) => {
          if (e.response.status === 500) {
            localStorage.removeItem("token");
            navigate("/");
          }
        });
    }, 1000);
  };

  const ckeditorstate = (event, editor) => {
    const data = editor.getData();
    setContent(data);
  };
  // *for emergency edit url
  // function replaceChar(origString, replaceChar, index) {
  //   let firstPart = origString.substr(0, index);
  //   let lastPart = origString.substr(index + 1);

  //   let newString = firstPart + replaceChar + lastPart;
  //   return newString;
  // }
  // const editUrl = (v) => {
  //   let updatedurl = v
  //     .split(" ")
  //     .join("-")
  //     .replace(/[.,#<>~“”''{}|%"\s]/g, "")
  //     .substring(0, 60)
  //     .toLowerCase();

  //   let finddash = updatedurl.charAt(updatedurl.length - 1);
  //   let removelastdash = replaceChar(updatedurl, "", updatedurl.length - 1);

  //   if (finddash === "-") {
  //     setUrl(removelastdash);
  //   } else {
  //     setUrl(updatedurl);
  //   }
  // };
  const alreadyfound = (ary1, ary2) => {
    let output = 0;
    for (let t = 0; t < ary1.length; t++) {
      if (ary2.includes(ary1[t]._id)) {
        output = ary1[t]._id;
      }
    }
    return output;
  };

  const handleCategorySelection = (event, value, subcates, buckets) => {
    if (subcates) {
      let checking = alreadyfound(buckets.subcategories, selectedSubCategory);
      let copysubcategory = [...selectedSubCategory];
      if (checking !== 0) {
        let x = copysubcategory.filter((i) => i !== checking);
        x.push(value._id);
        setSelectedSubCategory(x);
      } else {
        setSelectedSubCategory(selectedSubCategory.concat(value._id));
      }
    } else {
      if (event.target.checked) {
        setSelectedCategory(selectedCategory.concat(value._id));
      } else {
        setSelectedCategory(selectedCategory.filter((i) => i !== value._id));
        let findedvalue = 0;
        for (let i = 0; i < value.subcategories.length; i++) {
          if (selectedSubCategory.includes(value.subcategories[i]._id)) {
            findedvalue = value.subcategories[i]._id;
            break;
          }
        }
        setSelectedSubCategory(
          selectedSubCategory.filter((i) => i !== findedvalue)
        );
      }
    }
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <ModelUpload
        catname={catname}
        changeCatname={(e) => setCatname(e.target.value)}
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
      />
      <Modal show={imageEditing} size="xl">
        <Modal.Header>
          <Modal.Title>Image editor</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ height: "40rem", overflow: "hidden", overflowY: "scroll" }}
        >
          <Row>
            <Col xl={12}>
              {ffile != null && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                >
                  <Image
                    ref={imgRef}
                    src={URL.createObjectURL(ffile)}
                    width="100%"
                  />
                </ReactCrop>
              )}
            </Col>
            <Col xl={12}>
              {!!completedCrop && (
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: "1px dashed #000",
                    objectFit: "cover",
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setImageEditing(false);
              setFFile(null);
              setPrImg(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (prImg == null) {
                alert("crop your image !");
              } else {
                setImageEditing(false);
              }
            }}
          >
            Use Image
          </Button>
        </Modal.Footer>
      </Modal>
      <Header />

      <Container fluid>
        <Row className="MainSectionRow">
          <Col xl={8} lg={6} md={12} xs={12}>
            <div className="EditorWrraper">
              <div className="mb-5">
                <h3>
                  Add Content
                  <Button
                    onClick={() => postUpload()}
                    className="ms-4"
                    variant={publish === "published" ? "success" : "secondary"}
                  >
                    Save
                  </Button>
                </h3>
              </div>

              <Row className="EditorSpace p-0">
                <Col xl={6} className="EditorSize">
                  <Tabs id="controlled-tab-example" className="mb-3">
                    <Tab eventKey="Content" title="Content">
                      <CKEditor
                        data={content}
                        editor={ClassicEditor}
                        onChange={ckeditorstate}
                        config={{
                          ckfinder: {
                            uploadUrl: "/upload",
                            withCredentials: true,
                            headers: {
                              "X-CSRF-TOKEN": "CSFR-Token",
                              Authorization: "Bearer <JSON Web Token>",
                            },
                          },
                          mediaEmbed: {
                            providers: [{}],
                          },
                        }}
                      />
                    </Tab>
                    <Tab eventKey="Html" title="Html">
                      <textarea
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        style={{
                          height: "100vh",
                          width: "100%",
                          border: "none",
                          outline: "none",
                        }}
                        placeholder="write your html......"
                      ></textarea>
                    </Tab>
                    <Tab eventKey="Preview" title="Preview">
                      <Markup content={content} />
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </div>
          </Col>

          <Col xl={4} lg={6} md={12} xs={12} className="p-0">
            <div className="Sidebar">
              <div>
                <h3>Update Post</h3>
              </div>
              <div className="mt-4">
                <Form.Label>
                  <strong>Approved Post</strong>
                </Form.Label>
                <Form.Check
                  onChange={(e) => setApproved(e.target.checked)}
                  checked={approved}
                  type="switch"
                  id="custom-switch"
                  label="Approved"
                />
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Featured Image</strong>
                </Form.Label>
                <Form.Control
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    color: "transparent",
                    userSelect: "none",
                  }}
                  type="file"
                  onChange={(e) => {
                    if (Math.round(e.target.files[0].size / 1024 > 1096)) {
                      alert("File size must under 1mb!");
                    } else {
                      setFFile(e.target.files[0]);
                      setImageEditing(true);
                    }
                  }}
                  accept="image/png,image/jpg,image/jpeg,image/svg"
                />
                <center className="mt-3">
                  {prImg != null ? (
                    <>
                      <Image src={URL.createObjectURL(prImg)} width={100} />
                      <div>
                        <Badge bg="danger" onClick={() => setPrImg(null)}>
                          Remove
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <>
                      {dummyImg != null && (
                        <>
                          <Image src={dummyImg} width={100} />
                          <div>
                            <Badge bg="info">Current Featured Image </Badge>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </center>
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Title</strong>
                </Form.Label>
                <Form.Control
                  disabled
                  value={mainTitle}
                  onChange={(e) => {
                    setMainTitle(e.target.value);
                    // editUrl(e.target.value);
                    // setSeoDescription(e.target.value);
                  }}
                  type="text"
                  placeholder="Enter title here"
                />
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Author</strong>
                </Form.Label>
                <Form.Control
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  type="text"
                  placeholder="Enter Author Name"
                />
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Company Name</strong>
                </Form.Label>
                <Form.Control
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  type="text"
                  placeholder="Enter Company Name"
                />
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Summary</strong>
                </Form.Label>
                <FloatingLabel controlId="floatingTextarea2" label="Summary">
                  <Form.Control
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    as="textarea"
                    placeholder="Summary"
                    style={{ height: "100px" }}
                  />
                </FloatingLabel>
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>SEO Title</strong>
                </Form.Label>
                <Form.Control
                  value={seotitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  type="text"
                  placeholder="Enter Page title here"
                />
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>SEO Description</strong>
                </Form.Label>
                <FloatingLabel
                  controlId="floatingTextarea2"
                  label="SEO Description"
                >
                  <Form.Control
                    value={seodescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    as="textarea"
                    placeholder="SEO Description"
                    style={{ height: "100px" }}
                  />
                </FloatingLabel>
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>SEO Keywords</strong>
                </Form.Label>
                <FloatingLabel
                  controlId="floatingTextarea2"
                  label="SEO Keywords"
                >
                  <Form.Control
                    value={seokeywords}
                    onChange={(e) => setSeokeywords(e.target.value)}
                    as="textarea"
                    placeholder="SEO Keywords"
                    style={{ height: "100px" }}
                  />
                </FloatingLabel>
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Update Release Date</strong>
                </Form.Label>
                <Form.Control
                  value={timestampToDate(releaseDate)}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  type="datetime-local"
                  placeholder="Release Date"
                  // min={timestampToDate(releaseDate)}
                />
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Categories</strong>
                </Form.Label>

                <div className="SearchWrraper">
                  <Form.Control
                    value={searchText}
                    onChange={(e) => {
                      searchCategories(e.target.value);
                      setSerachText(e.target.value);
                    }}
                    type="text"
                    placeholder="Search category...."
                  />
                  {loader ? (
                    <div className="mt-3 text-center">
                      <Spinner animation="border" variant="success" />
                    </div>
                  ) : (
                    <>
                      <div className="mt-3">
                        {searchCateg?.map((k, i) => (
                          <>
                            <div key={i}>
                              <input
                                checked={
                                  selectedCategory.includes(k._id)
                                    ? true
                                    : false
                                }
                                type="checkbox"
                                onChange={(e) =>
                                  handleCategorySelection(e, k, false)
                                }
                              />{" "}
                              {k.title}
                            </div>
                            {selectedCategory?.includes(k._id) ? (
                              <div className="TagsWrraper">
                                {k?.subcategories?.map((v, i) => (
                                  <div className="ms-3">
                                    <input
                                      type="radio"
                                      name={k._id}
                                      defaultChecked={selectedSubCategory.includes(
                                        v._id
                                      )}
                                      onChange={(e) => {
                                        handleCategorySelection(e, v, true, k);
                                      }}
                                    />
                                    {v.title}&nbsp;
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </>
                        ))}
                      </div>
                      {suggestion && (
                        <div className="SuggestText">
                          <b>
                            Suggest for add category "{searchText}"&nbsp;&nbsp;
                            <Badge
                              bg="success"
                              className="BadgeClk"
                              onClick={() => setShow(true)}
                            >
                              <IoMdAddCircle size={20} />
                            </Badge>
                          </b>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Slug URL</strong>
                </Form.Label>

                <Form.Control
                  disabled
                  placeholder="My-New-post"
                  id="basic-url"
                  aria-describedby="basic-addon3"
                  value={url}
                  // onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Web URL</strong>
                </Form.Label>

                <Form.Control
                  placeholder="My-New-post"
                  id="basic-url"
                  aria-describedby="basic-addon3"
                  value={weburl}
                  onChange={(e) => setWeburl(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <Form.Label>
                  <strong>Publish / Draft</strong>
                </Form.Label>
                <Form.Check
                  onChange={(e) =>
                    setPublish(e.target.checked ? "published" : "draft")
                  }
                  checked={publish === "published" ? true : false}
                  type="switch"
                  id="custom-switch"
                  label="Publish"
                />
              </div>

              <div className="mt-4">
                <Form.Label>
                  <strong>Paid / Not paid</strong>
                </Form.Label>
                <Form.Check
                  onChange={(e) => setPaid(e.target.checked)}
                  checked={paid}
                  type="switch"
                  id="custom-switch"
                  label="Paid"
                />
                {paid ? (
                  <Form.Control
                    placeholder="Total Paid amount"
                    id="basic-url"
                    aria-describedby="basic-addon3"
                    value={paidprice}
                    className="mt-3"
                    onChange={(e) => setPaidPrice(e.target.value)}
                  />
                ) : null}
              </div>
              <div className="mt-4">
                <Form.Label>
                  <strong>Pin to Home page</strong>
                </Form.Label>
                <Form.Check
                  onChange={(e) => setHomePin(e.target.checked)}
                  checked={homePin}
                  type="switch"
                  id="custom-switch"
                  label="Pin to Home page"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
