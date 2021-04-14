import DataService from "../../services/DataService";
import React from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { time } from "../../services/Time";
import CommentsPreview from "./CommentsPreview";
const useStyles = makeStyles((theme) => ({
  commentBox: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: "2rem",
  },
  inputGroup: {
    display: "flex",
    justifyContent: "center",
  },
  sendButton: {
    margin: "0.2rem 0.5rem",
  },
}));
export default function CommentBox(props) {
  const classes = useStyles();
  const [error, setError] = React.useState(false);
  const { id } = props;
  const initialCommentState = {
    userId: "",
    content: "",
    time: time,
  };
  const [comment, setComment] = React.useState(initialCommentState);
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    async function fetch() {
      await DataService.getComments(id)
        .then((response) => {
          // console.log(response);
          // console.log(response.data.comments);
          setComments(response.data.comments);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    fetch();
  }, [id]);
  const handleInputChange = (event) => {
    comment.content.length > 1 && setError(false);
    const { name, value } = event.target;
    setComment({ ...comment, [name]: value });
  };
  const sendComment = () => {
    var data = {
      id: time,
      userId: "",
      content: comment.content,
      time: time,
    };
    DataService.addComment(id, data)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        comment.content.length < 1 ? setError(true) : alert(e);
      });
  };
  // console.log(comments);
  return (
    <Paper elevation={3}>
      <Container className={classes.commentBox}>
        {/* first 2 comments */}
        {comments.length > 1 && <CommentsPreview comments={comments} />}

        <Container className={classes.inputGroup}>
          <TextField
            fullWidth
            size="small"
            required
            multiline
            rows={1}
            name="content"
            placeholder="Add a comment..."
            value={comment.content}
            onChange={handleInputChange}
            variant="outlined"
            error={error}
            helperText={error ? "Title cannot be empty" : ""}
          />
          <Button
            onClick={sendComment}
            variant="contained"
            color="primary"
            size="small"
            className={classes.sendButton}
          >
            Send
          </Button>
        </Container>
      </Container>
    </Paper>
  );
}
