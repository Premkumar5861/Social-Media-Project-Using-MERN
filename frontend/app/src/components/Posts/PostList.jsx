import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";

function PostList({ posts, fetchPosts, startChartHandler }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const handleClose = () => setMessage("");
  const [commentContent, setCommentContent] = useState({});

  const SubmitCommentHandler = async (postId) => {
    console.log("postId:", postId);
    console.log("commentContent:", commentContent);

    console.log("content:", commentContent[postId]);
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        `/api/posts/${postId}/comments`,
        { content: commentContent[postId] },
        config,
      );
      setCommentContent({ ...commentContent, [postId]: "" });
      fetchPosts();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
  };
  const DeletePostHandler = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?"))
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/posts/${postId}`, config);
        fetchPosts();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        );
      }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" onClose={() => setError(null)}>
          {error}
        </Message>
      ) : (
        posts?.map((post) => (
          <Card key={post._id} className="my-3">
            <Card.Body>
              <Card.Title>
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        post?.user?.profilePicture ||
                        "https://via.placeholder.com/50"
                      }
                      alt={post?.user?.username}
                      className="rounded-circle me-2"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />

                    <span>{post?.user?.username}</span>
                    <Button
                    className="m-2"
                      variant="success"
                      onClick={() => startChartHandler(post.user._id)}
                    >
                      Chat
                    </Button>
                  </div>

                  <span>
                    {post.user._id ===
                      JSON.parse(localStorage.getItem("userInfo"))._id && (
                      <Button
                        variant="danger"
                        className="btn-sm position-absolute top-0 end-0 m-3  btn-outline"
                        onClick={() => DeletePostHandler(post._id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </Button>
                    )}
                  </span>
                </div>
              </Card.Title>

              <Card.Text>{post.content}</Card.Text>
              <Card.Text>
                <small className="text-body-secondary">
                  Posted at : {post.createdAt}
                </small>
              </Card.Text>
              {post?.image && (
  <div style={{
    width: '100%',
    aspectRatio: '1/1',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '12px'
  }}>
    <img
      src={post.image}
      alt="Post image"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center'
      }}
    />
  </div>
)}
            </Card.Body>
            <div
              className="accordion accordion-flush"
              id={`accordionFlishExample-${post._id}`}
            >
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#flush-collapseOne-${post._id}`}
                    aria-expanded="false"
                    aria-controls={`#flush-collapseOne-${post._id}`}
                  >
                    Comments . <i className="fa-regular fa-comment"></i>
                  </button>
                </h2>
                <div
                  id={`flush-collapseOne-${post._id}`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#accordionFlushExample-${post._id}`}
                >
                  <div className="accordion-body">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        SubmitCommentHandler(post._id);
                      }}
                    >
                      <Form.Group controlId={`commentContent-${post._id}`}>
                        <Form.Control
                          type="text"
                          placeholder="Write a comment..."
                          value={commentContent[post._id] || ""}
                          onChange={(e) => {
                            setCommentContent({
                              ...commentContent,
                              [post._id]: e.target.value,
                            });
                          }}
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="primary"
                        className="mt-2 btn-sm"
                      >
                        Comment
                      </Button>
                    </Form>

                    <div className="mt-2">
                      {post.comments.map((comment) => (
                        <div key={comment._id}>
                          <strong>{comment.user?.username}</strong> :{" "}
                          {comment.content}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </>
  );
}

export default PostList;
