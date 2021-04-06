import React, {useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

import { map } from 'lodash';

import { useSelector } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/router';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function PageWithDrawer({window, type, files, children}) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAnnotation, setOpenAnnotation] = useState(false);
  const [openClassification, setOpenClassification] = useState(false);

  const annotationFiles = useSelector(state => state.files.annotation);
  const classificationFiles = useSelector(state => state.files.classification);

  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
          <ListItem button>
            <Link href='/products/annotation'>
              <ListItemText button primary='Annotation' />
            </Link>
            <IconButton
              onClick={
                () => {
                  setOpenAnnotation(!openAnnotation);
                }
              }
            >
              {openAnnotation ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItem>
          <Collapse in={openAnnotation} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {
                map(annotationFiles, file => (
                  <ListItem button className={classes.nested} key={file}>
                    <ListItemText primary={file} />
                  </ListItem>
                ))
              }
            </List>
          </Collapse>


          <ListItem
            button
          >
            <Link href='/products/classification'>
              <ListItemText primary='Classification' />
            </Link>
            <IconButton
              onClick={
                () => {
                  setOpenClassification(!openClassification);
                }
              }
            >
              {openClassification ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItem>

          <Collapse in={openClassification} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {
                map(classificationFiles, file => (
                  <ListItem button className={classes.nested} key={file}>
                    <ListItemText primary={file} />
                  </ListItem>
                ))
              }
            </List>
          </Collapse>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

PageWithDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default PageWithDrawer;
