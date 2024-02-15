import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AccountCircle } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux'
import { setUser } from '../../../redux/actions/user'

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({children,headerText,drawList}) {
  const dispatch = useDispatch()
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {headerText}
          </Typography>
          <div>
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
                   vertical: 'top',
                   horizontal: 'right',
                 }}
                 keepMounted
                 transformOrigin={{
                   vertical: 'top',
                   horizontal: 'right',
                 }}
                 open={Boolean(anchorEl)}
                 onClose={handleClose}
               >
                 <MenuItem><Link to='profile'>Profile</Link></MenuItem>
                 <MenuItem onClick={()=>dispatch(setUser(null))}>Logout</MenuItem>
               </Menu>
            </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
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
          {drawList.map(({name,icon,path}) => (
            <Link to={path}>
            <ListItem key={name} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
          {children}
      </Main>
    </Box>
  );
}
