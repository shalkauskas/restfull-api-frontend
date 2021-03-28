import React from "react";
import { useLocation, Link } from "react-router-dom";
import AddPost from "../components/AddPost";
import PostsList from "../components/PostsList";
import DataService from "../services/DataService";
import Skeleton from "../components/Skeleton";
import LoadMoreButton from "../components/LoadMoreButton";
import AddButton from "../components/AddButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";

export default function Index(props) {
  const [showAdd, setShowAdd] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [order, setOrder] = React.useState("new");
  const [submitted, setSubmitted] = React.useState(false);
  // reducer
  const reduce = (state, action) => {
    switch (action.type) {
      case "OnSuccess":
        return {
          loading: false,
          posts: action.payload,
          error: "",
        };
      case "OnFailure":
        return {
          loading: false,
          posts: [],
          error: "Something went wrong",
        };

      default:
        return state;
    }
  };
  const initialState = {
    posts: [],
    loading: true,
    error: "",
  };
  const [state, dispatch] = React.useReducer(reduce, initialState);

  // styles
  const useStyles = makeStyles({
    list: {
      maxWidth: "750px",
      minWidth: "275px",
      textAlign: "left",
    },
    tabs: {
      display: "flex",
      justifyContent: "center",
    },
    loadMoreWrapper: {
      textAlign: "center",
      paddingBottom: "1rem",
      display: state.loading ? "none" : "",
    },
  });
  const classes = useStyles();

  // infinite scroll
  const ref = React.useRef();
  let location = useLocation();
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          // setPage((prevValue) => prevValue + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    } else if (!hasNextPage) {
      observer.unobserve(ref.current);
    }
    return () => observer.disconnect();
  }, [hasNextPage, props, ref]);
  React.useEffect(() => {
    location.pathname === "/"
      ? setOrder("new")
      : location.pathname === "/best"
      ? setOrder("best")
      : setOrder("random");
    setPage(0);
  }, [location]);
  React.useEffect(() => {
    async function fetchPosts() {
      await DataService.getAllPublished(page, order)
        .then((response) => {
          console.log(response.data);
          setHasNextPage(response.data.hasNextPage);
          dispatch({ type: "OnSuccess", payload: response.data.posts });
          setSubmitted(false);
        })
        .catch((e) => {
          console.log(e);
          dispatch({ type: "OnFailure" });
        });
    }
    fetchPosts();
  }, [page, order, submitted]);
  console.log(state);
  // Tabs
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container className={classes.list} component="section">
      <Container className={classes.tabs} disableGutters>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label=" New" to="/" component={Link} />
          <Tab label="Best" to="/best" component={Link} />
          <Tab label="Random" to="/random" component={Link} />
        </Tabs>
        <AddButton showAdd={showAdd} setShowAdd={setShowAdd} />
      </Container>

      <Collapse in={showAdd}>
        <AddPost close={() => setShowAdd(false)} setSubmitted={setSubmitted} />
      </Collapse>

      <PostsList posts={state.posts} isAuthenticated={props.isAuthenticated} />
      {state.loading && <Skeleton />}

      <div ref={ref} className={classes.loadMoreWrapper}>
        <LoadMoreButton
          page={page}
          setPage={setPage}
          hasNextPage={hasNextPage}
        />
      </div>
    </Container>
  );
}
