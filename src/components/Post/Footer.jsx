import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import { green, red } from "@material-ui/core/colors";
import DataService from "../../services/DataService";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import CommentIcon from "@material-ui/icons/Comment";
import { Collapse } from "@material-ui/core";
import CommentBox from "./CommentBox";
const useStyles = makeStyles({
  footer: {
    padding: "1rem",
  },
  comments: {
    marginLeft: "2rem",
  },
});
export default function PostFooter(props) {
  const classes = useStyles();
  const { edit, postRatingCheck, post, id, setPost } = props;
  const [showComments, setShowComments] = React.useState(false);
  const user = JSON.parse(localStorage.getItem(`user`));
  const isAuthenticated = JSON.parse(localStorage.getItem(`isAuthenticated`));
  const updateRating = (modifier) => {
    const updateRatingAPI = (data) => {
      DataService.update(id || post.id, data)
        .then((response) => {
          setPost(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const updateLikesAPI = (operator) => {
      const data = {
        likes: user.id,
        switch: operator,
      };
      DataService.update(id || post.id, data)
        .then((response) => {
          setPost(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    if (modifier === postRatingCheck) {
      if (modifier === "up") {
        localStorage.setItem(post.id, "");
        const data = {
          rating: post.rating - 1,
        };
        isAuthenticated && updateLikesAPI("remove");
        updateRatingAPI(data);
      } else if (modifier === "down") {
        localStorage.setItem(post.id, "");
        const data = {
          rating: post.rating + 1,
        };
        isAuthenticated && updateLikesAPI("add");
        updateRatingAPI(data);
      } else {
        // console.log("Already voted");
      }
    } else {
      if (postRatingCheck === "up") {
        localStorage.setItem(post.id, "");
        const data = {
          rating: post.rating - 1,
        };
        isAuthenticated && updateLikesAPI("remove");
        updateRatingAPI(data);
      } else if (postRatingCheck === "down") {
        localStorage.setItem(post.id, "");
        const data = {
          rating: post.rating + 1,
        };
        isAuthenticated && updateLikesAPI("add");
        updateRatingAPI(data);
      } else {
        localStorage.setItem(post.id, modifier);
        const data = {
          rating:
            modifier === "up"
              ? post.rating + 1
              : "down"
              ? post.rating - 1
              : post.rating,
        };
        const operator = modifier === "up" ? "add" : "down" ? "remove" : null;
        isAuthenticated && updateLikesAPI(operator);
        updateRatingAPI(data);
      }
    }
    // console.log(modifier, postRatingCheck);
  };
  const ratingHandler = (score) => {
    // props.isAuthenticated ?
    updateRating(score);
    // : alert("You must be logged in to rate posts!");
  };
  return (
    <>
      <CardActions className={classes.footer}>
        <Grid container alignItems="center" justify="space-between">
          {/* author */}
          <Grid item xs={4}>
            {edit ? (
              <Tooltip title="Date added" placement="left">
                <Typography align="left" color="textSecondary">
                  {post.time}
                </Typography>
              </Tooltip>
            ) : (
              <Typography color="textSecondary">By {post.author}</Typography>
            )}
          </Grid>
          {/* comments */}
          <Grid item xs={4}>
            <Button
              onClick={() => setShowComments(!showComments)}
              size={"small"}
              align="center"
              className={classes.comments}
              startIcon={<CommentIcon />}
            >
              Comments
            </Button>
          </Grid>
          {/* likes */}
          <Grid item xs={4}>
            <Grid container alignItems="center" justify="flex-end">
              <Grid item xs={3}>
                {!edit && (
                  <IconButton
                    aria-label="Like"
                    onClick={() => ratingHandler("up")}
                  >
                    <ThumbUpIcon
                      style={{
                        color: postRatingCheck === "up" ? green[500] : "",
                      }}
                    />
                  </IconButton>
                )}
              </Grid>
              <Grid item xs={4}>
                <Tooltip title="Rating">
                  <Typography
                    color="textSecondary"
                    align="center"
                    variant="subtitle1"
                  >
                    [{post.rating}]
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                {!edit && (
                  <IconButton
                    aria-label="Dislike"
                    onClick={() => ratingHandler("down")}
                  >
                    <ThumbDownIcon
                      style={{
                        color: postRatingCheck === "down" ? red[900] : "",
                      }}
                    />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardActions>
      <Collapse in={showComments}>
        <CommentBox id={post.id} />
      </Collapse>
    </>
  );
}
