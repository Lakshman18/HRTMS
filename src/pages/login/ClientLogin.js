import React, { Fragment, useEffect,useContext } from 'react';
import { UserContext } from "../../Context";
import {toast} from 'react-toastify'
import './Style.css';
import { Form } from 'react-bootstrap';
import  { useNavigate    } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const ClientLogin = () => {

    const [user, token, userRole, pageSize, setUser, setToken, setUserRole, setPageSize] = useContext(UserContext);
    const [cookies, setCookie] = useCookies(['token', 'user', 'userRole'])

    const navigate  = useNavigate ();

    useEffect(() => {
        if(token) {
            navigate('/');
        }
      }, [])

      const handleAddSubmit = async (e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    email: e.target.email.value ,
                    password : e.target.password.value,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/client/login', requestOptions)
            response = await response.json();  

           if(response.status_code===200){
               console.log(response.message['userRole'])
                let expires = new Date()
                expires.setTime(expires.getTime() + (7200000))
                setCookie('token', response.message['jwt'], { path: '/',  expires})
                setCookie('userRole', response.message['userRole'], { path: '/',  expires})
                setCookie('user', e.target.email.value, { path: '/',  expires})
                setUser(e.target.email.value) 
                setToken(response.message['jwt'])
                setUserRole(response.message['userRole'])
                navigate('/');
            }
            else{
                console.log(response.message)
                toast.error(response.message);
            }    
        }    
        catch(error){      
            console.log(error)
            toast.error("Failed to login");
        }            
    };


  return (
    <Fragment>        

    <div className="form-login-body"> 
        <div className="container">
            <div className="row">
                <div className="col-lg-10 mx-auto login-desk">
                    <div className="row">
                        <div className="col-md-7 detail-box">
                        <img className="logo center" src="images/logo3.jpg" alt="logo" /> 
                            <div className="detailsh">
                                    <img className="help" src="images/help.png" alt="" />
                                <h3>Human Resource & Timesheet Management System</h3>
                                <p>-- Client Signin --</p>
                            </div>
                        </div>
                        <div className="col-md-5 loginform">
                                <h4>Welcome Back</h4>                   
                                <p>Signin to your Account</p>
                                <div className="login-det">
                                <Form onSubmit={handleAddSubmit}>
                                    <div className="form-row">
                                        <label >Username</label>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">
                                                <i className="far fa-user"></i>
                                            </span>
                                            </div>
                                            <input type="text" className="form-control" name="email" placeholder="Enter Username" aria-label="Username" aria-describedby="basic-addon1" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <label >Password</label>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">
                                                <i className="fas fa-lock"></i>
                                            </span>
                                            </div>
                                            <input type="password" className="form-control" name="password" placeholder="Enter Password" aria-label="Username" aria-describedby="basic-addon1" />
                                        </div>
                                    </div>
                                
                                <p className="forget"><a href="">Forget Password?</a></p>
                                
                                <button className="btn btn-sm btn-danger" type="submit" onSubmit={handleAddSubmit}>Login</button>
                                </Form>
                                
                                <div className="social-link">
                                    <p className="forget"><a onClick={()=> navigate('/login')}>Signin as Employee?</a></p>
                                </div>
                                
                                </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>

    </Fragment>
  );
};

export default ClientLogin;