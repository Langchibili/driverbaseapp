import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AddBox,CarRental, Chat, Delete, DirectionsCar, Edit, Info, Mode, QuestionMark, Score, Work } from '@mui/icons-material';
import { Home, Menu } from '@material-ui/icons';
import { Fab } from '@mui/material';
import { useRouter } from 'next/router'

export default function MobileSideBAr(props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const renderLinkIcon = (linkName)=>{
        if(linkName === 'Jobs') return <Work sx={{color:'green'}}/>
        if(linkName === 'Drivers') return <DirectionsCar sx={{color:'yellow'}}/>
        if(linkName === 'Car Owners') return <CarRental sx={{color:'violet'}}/>
        if(linkName === 'Help') return <QuestionMark color='info'/>
        if(linkName === 'About') return <Info color='info'/>
        if(linkName === 'Chat') return <Chat sx={{color:'darkcyan'}}/>
        if(linkName === 'Create Job') return <AddBox sx={{color:'aquamarine'}}/>
        if(linkName === 'Edit Jobs') return <Edit />
        if(linkName === 'Delete Jobs') return <Delete sx={{color:'red'}}/>
        if(linkName === 'Buy Points(JAPs)') return <Score sx={{color:'pink'}}/>
        if(linkName === 'Buy Points(JCPs)') return <Score sx={{color:'pink'}}/>
        if(linkName === 'Home') return <Home color='primary'/>
  }

  const renderLoggedInLinks = (texts,loggedInUserProfile,driverTexts)=>{
    if(loggedInUserProfile === 'logged-out') return <></>
    if(loggedInUserProfile.type === 'driver'){
      return (<List>
        {driverTexts.map((text, index) => (
        <ListItem key={text[0]} disablePadding onClick={(e)=>{router.push(text[1]); props.handlePageChange(e)}}>
            <ListItemButton>
            <ListItemIcon>
                {renderLinkIcon(text[0])}
            </ListItemIcon>
            <ListItemText primary={text[0]} sx={{color:'slategray'}} />
            </ListItemButton>
        </ListItem>
        ))}
    </List>)
    }
    return (<List>
        {texts.map((text, index) => (
        <ListItem key={text[0]} disablePadding onClick={(e)=>{router.push(text[1]); props.handlePageChange(e)}}>
            <ListItemButton>
            <ListItemIcon>
                {renderLinkIcon(text[0])}
            </ListItemIcon>
            <ListItemText primary={text[0]} sx={{color:'slategray'}} />
            </ListItemButton>
        </ListItem>
        ))}
    </List>)
}

  const router = useRouter()  // the router stuff
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[['Home','/'],['Jobs','/jobs?act=show-all'], ['Drivers','/drivers'], ['Car Owners','/car_owners'], ['Help','/ask'], ['About','/about']].map((text, index) => (
          window.location.pathname === "/" && text[0] === "Home"? '' :
          <ListItem key={text[0]} disablePadding onClick={(e)=>{router.push(text[1]); props.handlePageChange(e)}}>
            <ListItemButton>
              <ListItemIcon>
                {renderLinkIcon(text[0])}
              </ListItemIcon>
              <ListItemText primary={text[0]} sx={{color:'slategray'}} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {renderLoggedInLinks([['Create Job','/jobs?act=add'], ['Edit Jobs','/jobs?act=edit'], ['Delete Jobs','/jobs?act=delete'],['Buy Points(JCPs)','/points'],['Chat','/chat?uid=0']],props.loggedInUserProfile,[['Buy Points(JAPs)','/points'],['Chat','/chat?uid=0']])}
    </Box>
  );

  return (
    <div className="nav-header" style={{backgroundColor: 'transparent',marginTop:5,marginLeft:5}}>
      <React.Fragment>
          <Fab onClick={toggleDrawer('left', true)}><Menu color='secondary'/></Fab>
          <SwipeableDrawer
            anchor='left'
            open={state['left']}
            onClose={toggleDrawer('left', false)}
            onOpen={toggleDrawer('left', true)}
          >
            {list('left')}
          </SwipeableDrawer>
        </React.Fragment>
    </div>
  )
}


