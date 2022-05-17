import React, {useState, useEffect, useContext} from 'react';
import { UserContext } from "../../Context";
import {toast} from 'react-toastify'
import './profile.css';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, useLocation} from 'react-router-dom';
import {passwordValidation, comparePassword} from '../../utils/Validation';

const Profile = () => {

    const [data, setData] = useState([]);
    const [user, token, userRole] = useContext(UserContext);
    const [password1, setPassword1] = useState("");
    const [passwordErr, setPasswordErr] = useState("Error");
    const [passwordMatchErr, setPasswordMatchErr] = useState("Error");
    const [DPshow, setDPShow] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token                     
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/employee/EmpView', requestOptions)
            response = await response.json();  
            
            if(response.status_code===200){
                setData(response.message)
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){  
            console.log(error)    
            toast.error("Failed to fetch");
        }                
    }

    const passwordCheck = (pass) => {
        setPasswordErr(passwordValidation(pass));
    }

    const compareBothPasswords = (pass) => {
        setPasswordMatchErr(comparePassword(password1,pass));
    }

    const handleEditSubmit =  async(e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    firstName : e.target.firstName.value,
                    lastName : e.target.lastName.value,
                    email : e.target.email.value,
                    emergencyContact : e.target.emergencyContact.value,
                    phoneNumber : e.target.phoneNumber.value,
                    maritualStatus : e.target.maritualStatus.value,
                    address : e.target.address.value,
                    modifiedBy: user
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/employee/register', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                toast.success(response.message);
                getData()
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){  
            console.log(error)    
            toast.error("Failed to edit details");
        }                
    };

    const handlePasswordEditSubmit =  async(e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    email: user,
                    oldPassword : e.target.oldPassword.value,
                    newPassword : e.target.newPassword.value
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/employee/PwdChange', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                toast.success(response.message);
                navigate('/logout')
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){  
            console.log(error)    
            toast.error("Failed to change the password");
        }                
    };

    const handleDPShow = () => setDPShow(true);

    const handleModalClose = () => {setDPShow(false);  };

    const handlePictureEditSubmit =  async(e) => {
        e.preventDefault();
        try{
            let fileFormat = selectedFile.name.split(".").slice(-1)
            let fileFormats = ["JPG", "jpg", "JPEG", "jpeg", "png", "PNG"]

            if(fileFormats.includes(fileFormat[0])){
                const formData = new FormData();
                formData.append('token', token); 
                formData.append('image', selectedFile, selectedFile.name);
                formData.append('modifiedBy',user); 
    
                const requestOptions = {
                    method: 'PUT',
                    headers: {'Accept': 'application/json'},
                    body: formData
                };
                let response = await fetch(process.env.REACT_APP_APIURL + '/employee/pictureChange', requestOptions)
                response = await response.json();  
          
                if(response.status_code===200){
                    toast.success(response.message);
                    window.location.reload();
                }
                else{
                     setSelectedFile(null)   
                    toast.error(response.message);
                }    
            }
            else{
                toast.error("Only JPG and PNG file formats supported");
            }
        }    
        catch(error){  
            console.log(error) 
            setSelectedFile(null)   
            toast.error("Failed to change the profile picture");
        }  
        setDPShow(false);                
    };


    return ( 
        <React.Fragment>
            <div >
                <div className="body container rounded bg-white mt-5 mb-5" >
                    <div className="row">
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <img className="rounded-circle mt-5" width="150px"
                                     onClick={() => handleDPShow()} 
                                     src={data.image ? process.env.REACT_APP_APIURL + data.image : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                                /><span className="font-weight-bold">{data.firstName}</span><span className="text-black-50">{data.email}</span><span> </span></div>
                        </div>
                        <div className="col-md-5 border-right">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Profile Settings</h4>
                                </div>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="form-group">
                                        <div className="row mt-2">
                                            <div className="col-md-6"><label className="labels">First Name</label><input type="text" className="form-control" placeholder="first name" defaultValue={data.firstName} name="firstName" /></div>
                                            <div className="col-md-6"><label className="labels">Last Name</label><input type="text" className="form-control"  placeholder="last name" defaultValue={data.lastName} name="lastName" /></div>
                                        </div>      
                                    
                                        <div className="row mt-3">
                                            <div className="col-md-12"><label className="labels">Email</label><input type="text" name="email" className="form-control" placeholder="enter email" defaultValue={data.email} disabled={true}/></div>
                                            <div className="col-md-12"><label className="labels">Department Name</label><input type="text" name="department" className="form-control" placeholder="enter department name" defaultValue={data.department_name} disabled={true}/></div>
                                            <div className="col-md-12"><label className="labels">Designation Name</label><input type="text" name="designation" className="form-control" placeholder="enter designation name"  defaultValue={data.designation_name} disabled={true} /></div>
                                            <div className="col-md-12"><label className="labels">Mobile Number</label><input type="text" name="phoneNumber" className="form-control" placeholder="enter phone number" defaultValue={data.phoneNumber}/></div>
                                            <div className="col-md-12"><label className="labels">Address</label><input type="text" name="address" className="form-control" placeholder="address" defaultValue={data.address}/></div>
                                            <div className="col-md-12"><label className="labels">Maritual Status</label><input type="text" name="maritualStatus" className="form-control" placeholder="enter maritual status" defaultValue={data.maritualStatus}/></div>
                                            <div className="col-md-12"><label className="labels">Emergency Contact Number</label><input type="text" name="emergencyContact" className="form-control" placeholder="enter Emergency Contact Number" defaultValue={data.emergencyContact}/></div>
                                        </div>
                                        <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="submit" >Save Profile</button></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3 py-5">
                                <form onSubmit={handlePasswordEditSubmit}>
                                    <div className="form-group">
                                        <div className="d-flex justify-content-between align-items-center experience"><span>Change Password</span></div><br/>
                                        <div className="col-md-12"><label className="labels">Current Password</label><input type="password" className="form-control" placeholder="Old Password" name="oldPassword"/></div> <br/>
                                        <div className="col-md-12"><label className="labels">New Password</label><input onChange={e=> {setPassword1(e.target.value); passwordCheck(e.target.value)}} type="password" className="form-control" placeholder="New Password"  name="newPassword"/></div><br/>
                                        <div className="col-md-12"><label className="labels">Reenter New Password</label><input  disabled={passwordErr != "" ? true : false } onChange={e=> compareBothPasswords(e.target.value)} type="password" className="form-control" placeholder="Re Enter New Password"  name="newPassword1"/></div><br/>
                                        
                                        <div className="alert alert-danger" role="alert" hidden={passwordErr == "" || passwordErr == "Error"  ? true : false }>
                                            {passwordErr}
                                        </div>
                                        <div className="alert alert-danger" role="alert" hidden={passwordMatchErr == "" || passwordMatchErr == "Error"  ? true : false }>
                                            {passwordMatchErr}
                                        </div>
                                        
                                        <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="submit">Change Password</button></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={DPshow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Change Profile Picture</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={(e) => handlePictureEditSubmit(e)}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label>Profile Picture</Form.Label>
                                <Form.Control type="file"  name="image" onChange={(e) => setSelectedFile(e.target.files[0])}    /> 
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer  className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit"  size="md">
                            save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>   
        </React.Fragment>
    );
}
 
export default Profile;