import React, {useState, useEffect, useContext} from 'react';
import { UserContext } from "../../Context";
import { useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie'


const Logout = () => {

    const [user, token, userRole, setUser, setToken, setUserRole] = useContext(UserContext);
    const navigate  = useNavigate ();
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'user', 'userRole'])
    
    useEffect(() => { 
        logout()
    }, [])

    const logout = () =>{
        setToken()
        setUser()
        setUserRole()
        removeCookie("user");
        removeCookie("token")
        removeCookie("userRole")
        navigate('/login')
        }
   

    return ( 
        <React.Fragment>

        </React.Fragment>
    );
}
 
export default Logout;