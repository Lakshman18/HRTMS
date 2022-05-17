import React, {useEffect,useState, useContext} from 'react';
import {Nav,Navbar,NavbarText} from "reactstrap";
import * as FaIcons from 'react-icons/fa';
import {Link} from "react-router-dom";
import { UserContext } from "../Context";
import { useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie'
import { IconContext } from 'react-icons/lib';
import {toast} from 'react-toastify'


const Header = () => {
  
  const [data, setData] = useState([]);
  const [user, token, userRole, setUser, setToken, setUserRole] = useContext(UserContext);
  const navigate  = useNavigate ();
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user', 'userRole'])

  useEffect(() => { 
    getData()
  }, [])

  const getData = async(e) =>{
      try{
          const requestOptions = {
              method: 'POST',
              headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  token: cookies.token                     
              })
          };
          let response = await fetch(process.env.REACT_APP_APIURL + '/employee/EmpView', requestOptions)
          response = await response.json();  
          
          if(response.status_code===200){
              setData(response.message)
          }
          else{
              // toast.error(response.message);
          }    
      }    
      catch(error){  
          console.log(error)    
          toast.error("Failed to fetch");
      }                
  }

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
    <div >
      <Navbar light expand="md" style={{backgroundColor: '#7d3cff'}} >
        <Link to="/" style={{color:"white", textDecoration: 'none' }}>HRTMS Application</Link>
        <Nav className="mr-auto" navbar>
          
        </Nav>
        <NavbarText>
          <div  className="h-100 d-flex justify-content-center align-items-center">
            <Link to="/profile">
              <img className="rounded-circle article-img profile-photo" 
                src={data.image ? process.env.REACT_APP_APIURL + data.image : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                name="img" style={{width: "40px", height: "40px"}}/> 
            </Link> 
            
            <IconContext.Provider value={{ size: '30' }}>
              <FaIcons.FaSignOutAlt style={{color:"white"}} onClick={logout} />
            </IconContext.Provider>

          </div>
        </NavbarText>
      </Navbar>
    </div>
  );
};

export default Header;