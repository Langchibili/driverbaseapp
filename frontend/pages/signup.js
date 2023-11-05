import React from 'react';
import HtmlHead from '@/components/Meta/HtmlHead'
import HtmlFoot from '@/components/Meta/HtmlFoot'
import SignUpForm from  '@/components/Forms/SignUpForm'
import { api_url } from '@/Constants';
import UpAndBackButton from '@/components/Includes/UpAndBackButton';


export default function signup(props) {
    const [userType, setType] = React.useState({typeSet: false, type: 'driver'});
    const renderDriverSignUpForm = (e)=>{
        setType({typeSet: true, type: 'driver'});
    }
    const renderCarOwnerSignUpForm = (e)=>{
        setType({typeSet: true, type: 'car-owner'});
    }

    const renderSignUpForm = ()=>{
        if(userType.typeSet){
            if(userType.type === 'car-owner'){
                return (<div className="authincation h-100 m-1">
                <div className="container h-100">
                    <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-md-6">
                        <div className="authincation-content" style={{backgroundColor: 'blueviolet'}}>
                        <div className="row no-gutters">
                            <div className="col-xl-12" >
                            <SignUpForm api_url={api_url} user_type='car-owner'/>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>)
            }
            else{
                return (<div className="authincation h-100 m-1">
                        <div className="container h-100">
                            <div className="row justify-content-center h-100 align-items-center">
                            <div className="col-md-6">
                                <div className="authincation-content" style={{backgroundColor: 'rebeccapurple'}}>
                                <div className="row no-gutters">
                                    <div className="col-xl-12" >
                                    <SignUpForm api_url={api_url} user_type='driver'/>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>)
            }
        }
        else{
            return (
                    <div style={{margin:10,textAlign:'center'}}>
                        <h3>REGISTER AS A</h3>
                        <div className="btn-group">
                        <button style={{borderTopRightRadius:10,borderBottomRightRadius:10}} type="button" className="btn btn-primary" onClick={renderDriverSignUpForm}>DRIVER</button>
                        <button type="button" className="btn btn-default">  </button>
                        <button style={{borderTopLeftRadius:10,borderBottomLeftRadius:10}} type="button" className="btn btn-info" onClick={renderCarOwnerSignUpForm}>CAR OWNER</button>
                        </div>
                        </div>
                    )
        }
    }

    return (<>
        <HtmlHead pageTitle='Signup'/>
        <UpAndBackButton/>
                {renderSignUpForm()}
        <HtmlFoot/>
        </>)
}
