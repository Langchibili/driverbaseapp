import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { api_url, getJwt, getUserProfileUid, textHasEmailAddress, textHasPhoneNumber } from '@/Constants';
import ContentLoader from '@/components/Includes/ContentLoader';
import { Alert, IconButton } from '@mui/material';
import Messages from '../Lists/Messages';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from '@react-spring/web';
import { Cancel } from '@mui/icons-material';
import ImagesForUser from '../Includes/ImagesForUser';
import Link from 'next/link';

export default class ChatRoomFooter extends React.Component{
    constructor(props){
     super(props)
     this.state = {
          errorExists:false,
          errorMessage: '',
          media: null,
          media_type: '',
          selectedImageSrc : null,
          openImagesListModal: false
     }
     this.messageTextRef = React.createRef();
    }
    handleOnChange = (e)=>{
        this.setState({ // means you typing something
            errorExists: false
        })
    }

    handleSubmit = async (e) =>{
      const messageText =  this.messageTextRef.current.value
      if(this.state.media === null && messageText.length === 0){ // can't send empty message if it's not a media type
          this.setState({
            errorExists: true,
            errorMessage: "You cannot send a blank message. Please type a message."
          })
          return
      }
      if(textHasPhoneNumber(messageText)){
        if(this.props.loggedInUserProfile.type === "driver"){
            this.setState({
                errorExists: true,
                errorMessage: "You cannot add a phone number to a message, please remove the number to send message."
              })
        }
        else{
            this.setState({
                errorExists: true,
                errorMessage: <p>You cannot add a phone number to a message, please remove the number to send this message.<br/> We restrict exchange of contact details in order to protect users from spam and scams. <br/><strong>If you have to call this user, to initiate a voice interview for instance, then click on the call icon on the top right corner of this chat.</strong></p>
              })
        }
        return
      }

      if(textHasEmailAddress(messageText)){
        this.setState({
          errorExists: true,
          errorMessage: "You cannot add an email address to a message, please remove the email address to send message."
        })
        return
      }
      if(this.props.loggedInUserProfile.type === "driver"){
          if(this.props.loggedInUserProfile.chatpoints === null || this.props.loggedInUserProfile.chatpoints < 2){
            this.setState({
              errorExists: true,
              errorMessage: <div><Alert severity='warning'>You don't have enough chat points to send this message...</Alert> <br/><Link href="/points" style={{color:'red'}}>Buy Points</Link></div>
            })
            return
          }
          else{
             this.reduceUserChatPoints() // then we reduce your chat points every time you send a message
          }
      }

      let messageObject = {
        content: messageText
      }
      if(this.state.media !== null){ // if media type, add media related fields
        messageObject.content = this.state.media_type
        messageObject.type = "media"
        messageObject.media = this.state.media
        messageObject.media_type = this.state.media_type
      }
      this.messageTextRef.current.value = '' // clear message box
      this.setState({media:null,selectedImageSrc:null}) // clear the media message too
      this.props.sendMessage(messageObject,this.props.socket)// add socket in order to handle live update
      const chatpointsdisplay = document.getElementById('chatpointsdisplay')
      if(chatpointsdisplay !== null){
        const currentPoints = Math.abs(parseInt(chatpointsdisplay.textContent)) - 2
        chatpointsdisplay.textContent = currentPoints+" CPs"
      }
    }

    reduceUserChatPoints = ()=>{
        const reducedPoints = this.props.loggedInUserProfile.chatpoints === null? 0 : (parseInt(this.props.loggedInUserProfile.chatpoints) - 2)
        let points = this.props.loggedInUserProfile.chatpoints - 2
       // points -= 2
      
        console.log('the points',(points))
        fetch(api_url+'/users/'+this.props.loggedInUserProfile.id,{ // if it's a driver, reduce their chatpoints by 2
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getJwt()}`
            },
            body: JSON.stringify({chatpoints: reducedPoints})
        })
    }

    handleImagesListModalOpen = ()=>{
         const openImagesListModal = this.state.openImagesListModal
         this.setState({
            openImagesListModal: !openImagesListModal
         })
    }
    handleCloseImagesListModal = ()=>{
        const openImagesListModal = this.state.openImagesListModal
        this.setState({
           openImagesListModal: !openImagesListModal
        })
   }

   selectMedia = (media,media_type,selectedImageSrc)=>{
        const openImagesListModal = this.state.openImagesListModal
        this.setState({
            media: media,
            media_type: media_type,
            openImagesListModal: !openImagesListModal,
            selectedImageSrc: selectedImageSrc
        })
   }
    render(){
     return (
        <div className="z-40 w-full p-6 mb-0 bg-white border-t lg:mb-1 border-gray-50 dark:bg-zinc-800 dark:border-zinc-700" style={{position:"fixed",maxWidth:"800px",margin:'0 auto',bottom:"0",left:"0",right:"0"}}>
        { this.state.errorExists? <Alert sx={{marginBottom:1}} severity='error'>{this.state.errorMessage}</Alert> : ''}
        <ImagesListModal openImagesListModal={this.state.openImagesListModal} 
                         loggedInUserProfile={this.props.loggedInUserProfile} 
                         handleCloseImagesListModal={this.handleCloseImagesListModal}
                         selectMedia={this.selectMedia}/>
         {this.state.selectedImageSrc !== null? <>
                    <div>
                    <img
                        src={this.state.selectedImageSrc}
                        alt="License Front"
                        style={{width:'90px',height:'90px'}}
                        />
                    </div></> : ''}   
        <div className="flex gap-2">
        <div className="flex-grow">
            <input ref={this.messageTextRef} onChange={this.handleOnChange} type="text" className="w-full border-transparent rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300" placeholder="Enter Message..." />
        </div>
        <div>
            <div>
            <ul className="mb-0">
                {/* <li className="inline-block" title="Emoji">
                <button type="button" className="border-transparent group/tooltip btn relative group-data-[theme-color=violet]:dark:text-violet-200 group-data-[theme-color=green]:dark:text-green-200 group-data-[theme-color=red]:dark:text-red-200 group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500 text-16">
                    <div className="absolute items-center hidden -top-10 ltr:-left-2 group-hover/tooltip:flex rtl:-right-2">
                    <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black" />
                    <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Emoji</span>
                    </div>
                    <i className="ri-emotion-happy-line" />
                </button>
                </li> */}
                <li className="inline-block" title="Attached File">
                <button onClick={this.handleImagesListModalOpen} type="button" className="border-transparent btn group/tooltip group-data-[theme-color=violet]:dark:text-violet-200 group-data-[theme-color=green]:dark:text-green-200 group-data-[theme-color=red]:dark:text-red-200 group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500 text-16">
                    <div className="absolute items-center hidden -top-10 ltr:-left-2 group-hover/tooltip:flex rtl:-right-2">
                    <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black" />
                    <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Attached File</span>
                    </div>
                    <i className="ri-attachment-line" />
                </button>
                </li>
                <li className="inline-block">
                <button onClick={this.handleSubmit} className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:hover:bg-green-600">
                    <i className="ri-send-plane-2-fill" />
                </button>
                </li>
            </ul>
            </div>
        </div>
        </div>
    </div>
     )
    }
}


const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "90%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};

export  function ImagesListModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={props.openImagesListModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={props.openImagesListModal}>
          <Box sx={style}>
            <ImagesForUser 
                    loggedInUserProfile={props.loggedInUserProfile}
                    selectMedia={props.selectMedia}/>
           <div style={{width:'100%',textAlign:'center'}}>
           <IconButton onClick={props.handleCloseImagesListModal} aria-label="cancel">
              <Cancel />
            </IconButton>
           </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}