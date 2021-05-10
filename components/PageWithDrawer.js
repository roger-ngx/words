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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { get, map } from 'lodash';

import { useSelector, useDispatch } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { setFiles, addFile, setSelectedFileName, setSelectedType } from 'stores/fileSlice';
import { ListItemIcon } from '@material-ui/core';
import FilenameInputDialog from './FilenameInputDialog';
import { API_SERVER_ADDRESS } from 'constants/defaults';


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

function PageWithDrawer({window}) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAnnotation, setOpenAnnotation] = useState(false);
  const [openClassification, setOpenClassification] = useState(false);

  const userFiles = useSelector(state => get(state, 'files.projects.default', []));
  const currentUser = useSelector(state => state.user.username);
  const currentSelectedFile = useSelector(state => state.files.selectedFileName);

  const [ openFileInput, setOpenFileInput ] = useState(false);
  const [ currentUploadFile, setCurrentUploadFile ] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if(currentUser){
      getUserFiles(currentUser);
    }
  }, [currentUser]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onFinishInputFilename = fileName => {
      setOpenFileInput(false);

      const data = new FormData();
      data.append('file', currentUploadFile);
      data.append('projectName', 'default');
      data.append('fileName', fileName);
      data.append('username', currentUser);

      fetch(API_SERVER_ADDRESS+'/api/file/upload', {
          method: 'POST',
          body: data,
          mode: 'cors'
      }).then(res => {
          dispatch(addFile({project: 'default', file: fileName}));
      })
  }

  const fileUploadedHandle = e => {
    console.log(e.target.files);
    const file = e.target.files[0];

    setCurrentUploadFile(file);
    setOpenFileInput(true);
  }

  const getUserFiles = (username) => {
    const data = {
      username,
      projectName: 'default'
    };

    console.log('data', data);

    fetch(API_SERVER_ADDRESS + '/api/file/list', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(({files}) => dispatch(setFiles({project: 'default', files})));
  };

  const drawer = (
    <div>
      <div style={{padding: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>Welcome <b>{currentUser}</b></div>
        <div
          style={{fontSize: 12, border: 'solid 1px #ddd', padding: '4px 8px', borderRadius: 20, cursor: 'pointer'}}
          onClick={() => {
            localStorage.setItem('currentUser', '');
            router.push('/');
          }}
        >
          Logout
        </div>
      </div>
      <Divider />
      <div style={{padding: 16}}>
        Default Project
      </div>
      <Divider />
      <List>
        {
        map(userFiles, file => (
          <div key={file}>
            <ListItem
              button
              onClick={
                () => dispatch(setSelectedFileName(currentSelectedFile===file ? '' : file))
              }
            >
              <ListItemText button primary={file} />
              { currentSelectedFile===file ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={currentSelectedFile===file} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => {
                    dispatch(setSelectedType('classification'));
                  }}
                >
                  <ListItemText primary='Classification' />
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => {
                    dispatch(setSelectedType('annotation'));
                  }}
                >
                  <ListItemText primary='NER' />
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  disabled
                >
                  <ListItemText primary='AI Automation' />
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  disabled
                >
                  <ListItemText primary='MRC' />
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  disabled
                >
                  <ListItemText primary='SUM' />
                </ListItem>
              </List>
            </Collapse>
          </div>
        ))
        }
        <input
          style={{display: 'none', width: 0}}
          id='tsv_file_upload'
          multiple
          type='file'
          accept='.tsv'
          onChange={fileUploadedHandle}
          onClick={e => e.target.value = null}
        />
        <label htmlFor='tsv_file_upload'>
          <ListItem
            button
          >
            <ListItemIcon>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary='Add File' />
          </ListItem>
        </label>
      </List>
      <FilenameInputDialog
        open={openFileInput}
        setOpen={setOpenFileInput}
        onFinish={onFinishInputFilename}
      />
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
