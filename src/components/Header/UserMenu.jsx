import React from "react";
import { Link } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import AuthService from "../../services/AuthService";
import { GlobalContext } from "../../App";
export default function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, dispatch] = React.useContext(GlobalContext);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    AuthService.logout().then((response) => {
      dispatch({
        type: "OnLogout",
      });
      console.log(response);
    });
  };
  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar src={state.User.photoUrl} alt="user profile pic">
          <AccountCircle />
        </Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/dashboard">
          My content
        </MenuItem>
        <MenuItem component={Link} to="/dashboard/favorites">
          My favorites
        </MenuItem>
        <MenuItem component={Link} to="/dashboard/profile">
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
