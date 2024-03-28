import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AccountCircle,
  DeliveryDining,
  LocalGroceryStore,
} from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/actions/user";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({
  children,
  headerText,
  drawList,
  logo,
}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state) => state.user.user);
  const routes = useSelector((state) => state.routes.routes);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [StoreAnchorEl, setStoreAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStoreMenu = (event) => {
    setStoreAnchorEl(event.currentTarget);
  };

  const handleStoreClose = () => {
    setStoreAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              {headerText}
            </Typography>
          </div>
          <Link style={{ display: "flex" }} to="/">
            <img
              style={{ aspectRatio: 2 / 1 }}
              src="logo.png"
              alt="giveHubLogo"
            />
          </Link>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to="profile"
                >
                  Profile
                </Link>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setUser(null));
                  navigate("/");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
            {user.__t == "carrier" && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleStoreMenu}
                  color="inherit"
                >
                  <DeliveryDining />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={StoreAnchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(StoreAnchorEl)}
                  onClose={handleStoreClose}
                >
                  {Array.isArray(routes) &&
                    routes
                      .filter(
                        (value, index) =>
                          !routes.find(
                            (val, ind) =>
                              ind > index &&
                              JSON.stringify(val) == JSON.stringify(value)
                          )
                      )
                      .map((route) => (
                        <MenuItem>
                          ({route.lat},{route.lng})
                        </MenuItem>
                      ))}
                  <MenuItem>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to="/generate/true"
                    >
                      generate
                    </Link>
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {drawList.map(({ name, icon, path }) => (
            <Link
              key={name}
              style={{ textDecoration: "none", color: "black" }}
              to={path}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <div style={{ width: "100%" }}>
        <Main open={open}>
          <DrawerHeader />
          {children}
        </Main>
        <footer style={{ display: "flex", justifyContent: "flex-end" }}>
          <span>&copy;2024 GiveHub</span>
        </footer>
      </div>
    </Box>
  );
}
