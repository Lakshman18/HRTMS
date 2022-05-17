import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import Notice from './pages/noticeboard/Notice';
import Department from './pages/Department/Department';
import Client from './pages/client/Client';
import Project from './pages/project/Project';
import Designation from './pages/employee/Designation';
import Employee from './pages/employee/Employee';
import AddEmployee from './pages/employee/AddEmployee';
import EditProfile from './pages/employee/EditProfile';
import Role from './pages/employee/Role';
import Leave from './pages/leave/Leave';
import Attendance from './pages/attendance/Attendance';
import Timesheet from './pages/timesheet/Timesheet';
import Vacancy from './pages/recruitment/Vacancy';
import Applicant from './pages/recruitment/Applicant';
import ClientTimeSheet from './pages/timesheet/ClientTimeSheet';
import Profile from './pages/profile/Profile';
import ClientProfile from './pages/profile/ClientProfile';

import Login from './pages/login/Login';
import ClientLogin from './pages/login/ClientLogin';
import Logout from './pages/logout/Logout';

import 'react-pro-sidebar/dist/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./common/Header";
import SideNavigation from "./common/SideNavigation";
import { Routes,  Route, useNavigate} from "react-router-dom";
import React, {useEffect,useContext} from 'react';
import { UserContext } from "./Context";
import {ToastContainer} from 'react-toastify'

function App() {

  const [user, token, userRole] = useContext(UserContext);  
  const navigate  = useNavigate ();

  useEffect(() => {  
    if(!token) {
      navigate('/login');
    } 
    else{
      navigate('/');
    }
  }, [])

  const styles = {
    contentDiv: {
      display: "flex",
    },
    contentMargin: {
      marginLeft: "0px",
      width: "100%",
    },
  };

  return (
    <React.Fragment>
      <ToastContainer /> 
        
          <Routes>
            <Route exact path="/login"  element={<Login />}></Route>
            <Route path="/clientLogin" element={<ClientLogin />}> </Route>
          </Routes> 

          {
            user
            ?
            <div style={styles.contentDiv} >
              <SideNavigation style={{}}></SideNavigation>
              <div style={styles.contentMargin}>
              <Header></Header>
                  <Routes>
                    <Route  path="/login"  element={<Login />}></Route>
                    <Route path="/clientLogin" element={<ClientLogin />}> </Route>
                    <Route exact path="/"  element={userRole=="admin"?<Dashboard />:(userRole=="employee"||userRole=="manager")?<EmployeeDashboard /> :<ClientDashboard /> }></Route>
                    <Route path="/employee" element={<Employee />}> </Route>
                    <Route path="/role" element={<Role />}> </Route>
                    <Route path="/designation" element={<Designation />}> </Route>
                    <Route path="/addEmployee" element={<AddEmployee />}> </Route>
                    <Route path="/client" element={<Client />}> </Route>
                    <Route path="/project" element={<Project />}> </Route>
                    <Route path="/department" element={<Department />}> </Route>
                    <Route path="/noticeboard" element={<Notice />}> </Route>
                    <Route path="/attendance" element={<Attendance />}> </Route>
                    <Route path="/leave" element={<Leave />}> </Route>
                    <Route path="/timesheet" element={userRole!="client"?<Timesheet />:<ClientTimeSheet/>}> </Route>
                    <Route path="/vacancy" element={<Vacancy />}> </Route>
                    <Route path="/application" element={<Applicant />}> </Route>
                    <Route path="/application" element={<Login />}> </Route>
                    <Route path="/editProfile" element={<EditProfile />}> </Route>
                    <Route path="/profile" element={userRole!="client"?<Profile />:<ClientProfile/>}> </Route>
                    <Route path="/logout" element={<Logout />}> </Route>
                  </Routes>
              </div>
            </div>
            :
            <div></div>
          }
    </React.Fragment>
  );
}

export default App;