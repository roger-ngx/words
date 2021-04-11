import React, {useState, useEffect} from 'react';
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

import { map, size } from 'lodash';

import { useSelector, useDispatch } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { setFiles, setSelectedType, setSelectedFileName } from 'stores/fileSlice';


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

  const dispatch = useDispatch();

  useEffect(() => {
    getAnnotationFiles();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getAnnotationFiles = () => {
    const data = {
      type: 'annotation'
    };

    fetch('/api/file/file_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(files => dispatch(setFiles({type: 'annotation', files})));
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
          <Link href='/products/annotation'>
            <ListItem
              button
              onClick={
                () => {
                  setOpenAnnotation(!openAnnotation);
                  dispatch(setSelectedType('annotation'));
                }
              }
            >
                <ListItemText button primary='Annotation' />
                {size(annotationFiles) && (openAnnotation ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
          </Link>
          <Collapse in={openAnnotation} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {
                map(annotationFiles, file => (
                <Link href='/products/annotation'>
                  <ListItem
                    button
                    className={classes.nested}
                    key={file}
                    onClick={() => {
                      dispatch(setSelectedType('annotation'));
                      dispatch(setSelectedFileName(file));
                    }}
                  >
                    <ListItemText primary={file} />
                  </ListItem>
                </Link>
                ))
              }
            </List>
          </Collapse>

          <Link href='/products/classification'>
            <ListItem
              button
              onClick={
                () => {
                  setOpenClassification(!openClassification);
                  dispatch(setSelectedType('classification'));
                }
              }
            >
              <ListItemText primary='Classification' />
              {size(classificationFiles) > 0 && (openClassification ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
          </Link>

          <Collapse in={openClassification} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {
                map(classificationFiles, file => (
                  <ListItem
                    button
                    className={classes.nested}
                    key={file}
                    onClick={() => {
                      dispatch(setSelectedType('classification'));
                      dispatch(setSelectedFileName(file));
                    }}
                  >
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
