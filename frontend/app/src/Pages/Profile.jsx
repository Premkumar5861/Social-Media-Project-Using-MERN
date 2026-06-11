import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  ListGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import QRcode from "qrcode";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  // const [secret,setSecret] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  // const handleClose = () => setMessage("");
  const [userPosts, setUserPost] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userInfo = localStorage.getItem("userInfo");

        if (!userInfo) {
          navigate("/login");
          return;
        }
        const parsedUser = JSON.parse(userInfo);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedUser.token}`,
          },
        };
        const { data } = await axios.get("/api/users/profile", config);
        setUser(data);
        const { data: postsData } = await axios.get(
          `/api/posts/user/${parsedUser._id}`,
          config,
        );
        setUserPost(postsData);

        if (data.twoFactorAuthSecret) {
          const otpauthUrl = `otpauth://totp/SecretKey?secret=${data.twoFactorAuthSecret}`;
          QRcode.toDataURL(
            otpauthUrl,
            { width: 200, margin: 2 },
            (err, url) => {
              if (!err) {
                setQrCodeUrl(url);
              }
            },
          );
        }
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        );
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const searcHandler = async (e) => {
    e.preventDefault();
    try {
      if (!keyword.trim()) {
        setError("Please enter a username");
        return;
      }
      setLoading(true);
      setError(null);
      const userInfo = localStorage.getItem("userInfo");

      if (!userInfo) {
        navigate("/login");
        return;
      }
      const parsedUser = JSON.parse(userInfo);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedUser.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/users/search?keyword=${keyword}`,
        config,
      );
      setResult(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const startChartHandler = async (userId) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);
      navigate(`/chat/${data._id}`);
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
  };

  const uploadProfilePictureHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const userInfo = localStorage.getItem("userInfo");

      if (!userInfo) {
        navigate("/login");
        return;
      }
      const parsedUser = JSON.parse(userInfo);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${parsedUser.token}`,
        },
      };

      const formData = new FormData();
      formData.append("profilePicture", profilePicture);

      const { data } = await axios.post(
        "/api/users/profile/uploads",
        formData,
        config,
      );
      setMessage("Profile picture uploaded successfully");
      setUser({ ...user, profilePicture: data.profilePicture });
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const enable2FA = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const userInfo = localStorage.getItem("userInfo");
      const parsedUser = JSON.parse(userInfo);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedUser.token}`,
        },
      };
      const { data } = await axios.post(`/api/auth/enable-2fa`, {}, config);
      // setSecret(data.secret);
      const otpauthUrl = data.secret;
      QRcode.toDataURL(otpauthUrl, { width: 200, margin: 2 }, (err, url) => {
        if (err) {
          setError("Failed to create QR Code.");
        } else {
          setQrCodeUrl(url);
        }
      });
      setMessage("Two Factor authentication enable successfully..");
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId) => {
    try {
      setLoading(true);

      const userInfo = localStorage.getItem("userInfo");
      const parsedUser = JSON.parse(userInfo);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedUser.token}`,
        },
      };

      await axios.post(`/api/users/follow/${userId}`, {}, config);
      setMessage("User followed succesfully");

      const { data } = await axios.get("/api/users/profile", config);
      setUser(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const unFollowUser = async (userId) => {
    try {
      setLoading(true);
      const userInfo = localStorage.getItem("userInfo");
      const parsedUser = JSON.parse(userInfo);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedUser.token}`,
        },
      };

      await axios.post(`/api/users/unfollow/${userId}`, {}, config);
      setMessage("User UnFollowed Successfully.");
      const { data } = await axios.get("/api/users/profile", config);
      setUser(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col md="5">
            <Card className="mt-4 p-3">
              <h3 className="text-center bg-light text-dark">Profile</h3>
              {message && <Message variant="success">{message}</Message>}

              {/* Profile pic*/}

              <div className="text-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="rounded-circle"
                    width="100"
                    height="100"
                  />
                ) : (
                  <div
                    className="placeholder rounded-circle"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  ></div>
                )}
              </div>
              <Form onSubmit={uploadProfilePictureHandler}>
                <Form.Group>
                  <Form.Control
                    type="file"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                  ></Form.Control>
                </Form.Group>
                <Button
                  type="submit"
                  variant="light"
                  className="mt-3 btn btn-outline-primary "
                >
                  Upload/Edit Profile Picture
                </Button>
              </Form>
              <ul className="list-group mt-1">
                <li className="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center">
                  <strong>Username:</strong>
                  {user.username}
                </li>
                <li className="list-group-item list-group-item-light d-flex justify-content-between align-items-center">
                  <strong>Email:</strong>
                  {user.email}
                </li>
                {!user.twoFactorAuth && (
                  <Button
                    onClick={enable2FA}
                    variant="primary"
                    className="mt-3"
                  >
                    Enable 2FA
                  </Button>
                )}
                {qrCodeUrl && (
                  <div
                    className="accordion accordion-flush mt-2"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseOne"
                        >
                          Authenticate QR Code
                        </button>
                      </h2>
                      <div
                        id="flush-collapseOne"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <img src={qrCodeUrl} alt="2FA QR Code" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ul>
            </Card>
          </Col>
          <Col md="7">
            <Card className="mt-4 p-3">
              <h3 className="text-center bg-light text-dark mt-2">
                Search Users
              </h3>
              <Form onSubmit={searcHandler} className="d-flex">
                <Form.Group controlId="keyword">
                  <Form.Control
                    type="text"
                    placeholder="Search by username"
                    value={keyword}
                    className="form-control me-sm-2"
                    onChange={(e) => setKeyword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button className="btn btn-primary my-2 my-sm-0" type="submit">
                  Search
                </Button>
              </Form>
              {loading && <Loader />}
              {error && <Message variant="danger">{error}</Message>}
              <ListGroup className="mt-4">
                {result.map((result) => (
                  <ListGroup.Item key={result._id}>
                    <Link to={`/user/${result._id}`}>
                      <span>{result.username}: </span>
                    </Link>
                    <Button
                      variant="primary"
                      className="ml-4"
                      onClick={() => {
                        followUser(result._id);
                      }}
                    >
                      Follow
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => startChartHandler(result._id)}
                    >
                      chat
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Row>
                <Col md={6}>
                  <h5 className="mt-4 bg-light p-2 text-center">
                    Followers{" "}
                    <span className="badge bg-primary rounded-pill">
                      {user.followers?.length}
                    </span>
                  </h5>

                  {user.followers?.map((follower) => (
                    <Row className="g-2">
                      <Col key={follower._id}>
                        <Card className="h-100 text-center">
                          <Card.Body className="d-flex align-items-center">
                            <Link to={`/user/${follower._id}`}>
                              <Card.Img
                                variant="top"
                                src={
                                  follower.profilePicture ||
                                  "https://via.placeholder.com/50"
                                }
                                alt={follower.username}
                                className="rounded-circle me-2"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
                            <Card.Title className="mb-0">
                              <Link to={`/user/${follower._id}`}>
                                {follower.username}
                              </Link>
                            </Card.Title>

                            <Button
                              variant="success"
                              className="ms-2 btn-sm"
                              onClick={() => followUser(follower._id)}
                            >
                              Follow
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  ))}
                </Col>

                <Col md={6}>
                  <h5 className="mt-4 bg-light p-2 text-center">
                    Following{" "}
                    <span className="badge bg-primary rounded-pill">
                      {user.following?.length}
                    </span>
                  </h5>
                  {user.following?.map((following) => (
                    <Row className="g-2" key={following._id}>
                      <Col>
                        <Card className="h-100 text-center">
                          <Card.Body className="d-flex align-items-center">
                            <Link to={`/user/${following._id}`}>
                              <Card.Img
                                variant="top"
                                src={
                                  following.profilePicture ||
                                  "https://via.placeholder.com/50"
                                }
                                alt={following.username}
                                className="rounded-circle me-2"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
                            <Card.Title className="mb-0">
                              <Link to={`/user/${following._id}`}>
                                {following.username}
                              </Link>
                            </Card.Title>
                            <Button
                              variant="danger"
                              className="ms-2 btn-sm"
                              onClick={() => unFollowUser(following._id)}
                            >
                              Unfollow
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  ))}
                </Col>
              </Row>
              <hr />
              <h3 className="text-center mt-2">Your Posts</h3>
              <Row className="g-2">
  {userPosts.map((post) => (
    <Col key={post._id} xs={4}>
      <Link to={`/post/${post._id}`}>
        <div style={{
          width: '100%',
          aspectRatio: '1/1',
          overflow: 'hidden',
          borderRadius: '4px'
        }}>
          <img
            src={post.image || 'https://via.placeholder.com/150'}
            alt="Post"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      </Link>
    </Col>
  ))}
</Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
