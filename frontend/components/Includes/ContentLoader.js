import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { registerServiceWorker } from '@/Constants';

export default function ContentLoader(props) {
  return (<div style={{ position:'fixed', height:'100%', width:'100%',margin:'0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '80%', height: '80%' }}>
    <CircularProgress color="secondary" disableShrink /><p>{props.text? props.text: ''}</p>
  </div>
  </div>);
}
