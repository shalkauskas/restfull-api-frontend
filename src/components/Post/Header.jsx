import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ShareIcon from "@material-ui/icons/Share";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { green } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import PostEditButtons from "./EditButtons";
const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  id: {
    color: green[400],
    fontSize: "16px",
  },
  time: {
    textAlign: "center",
  },
});
export default function PostHeader(props) {
  const { id, post, edit, editMode, setEditMode } = props;
  const classes = useStyles();
  const postId = (id || window.location.pathname.slice(6)).replace(/\D/g, "");
  const shareButton = () => {
    navigator.clipboard.writeText(
      window.location.href + `post/${id || post.id}`
    );
  };
  return (
    <Grid container alignItems="center">
      <Grid item xs={6}>
        <Button
          className={classes.id}
          color="secondary"
          to={{
            pathname: `/post/${id || post.id}`,
          }}
          component={Link}
        >
          <u>#{postId.slice(postId.length - 5)}</u>
        </Button>
        <Tooltip title="Copy link">
          <IconButton aria-label="Share" onClick={shareButton}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={6}>
        {edit ? (
          <PostEditButtons
            postId={post.id}
            editMode={editMode}
            setEditMode={setEditMode}
          />
        ) : (
          <Typography align="right" color="textSecondary">
            {post.time}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
