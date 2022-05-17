import { useState, useContext } from "react";
import { AiOutlineMenu,AiFillNotification, AiOutlineFieldTime } from "react-icons/ai";

import { MdOutlineDashboard } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { FcBusinessman,  FcBusiness, FcDepartment,FcLeave } from "react-icons/fc"; 
import { FaPeopleArrows } from "react-icons/fa"; 
import { MdOutlineCalendarToday } from "react-icons/md";

import {Menu,MenuItem,ProSidebar,SidebarHeader,SubMenu} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {Link} from "react-router-dom";
import { UserContext } from "../Context";


const SideNavigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, token, userRole] = useContext(UserContext);

  // added styles 
  const styles = {
    sideBarHeight: {
      position: "-webkit-sticky",
      position:"sticky",
      top: "0",
      padding: "0px",
      height:"100vh"

    },
    menuIcon: {
      float: "right",
      margin: "10px",
    }
  };
  const onClickMenuIcon = () => { 
    setCollapsed(!collapsed);
  };
  return (
    <ProSidebar className="bg-color" style={styles.sideBarHeight} collapsed={collapsed}>
      
        <SidebarHeader className="bg-color"  style={{paddingBottom:"35px"}}> 
          <div style={styles.menuIcon} onClick={onClickMenuIcon} className="h-100 d-flex justify-content-center align-items-center">
            <AiOutlineMenu />
          </div>
        </SidebarHeader>

        <Menu iconShape="square">
          <MenuItem icon={<MdOutlineDashboard />}> <Link to="/">Dashboard</Link> </MenuItem>
          {
            userRole=="admin"?
            <SubMenu title="Users" icon={<RiUserSettingsFill />} >
              <MenuItem ><Link to="/employee">Employee</Link> </MenuItem>
              <MenuItem ><Link to="/designation">Designation</Link> </MenuItem>
              <MenuItem ><Link to="/role">Role</Link> </MenuItem>
              <MenuItem ><Link to="/addEmployee">Add Employee</Link> </MenuItem>
            </SubMenu> 
            :
            <></>
          }
          {
            userRole=="admin"?
            <>
            <MenuItem icon={<FcBusinessman />}> <Link to="/client">Client</Link> </MenuItem>          
            <MenuItem icon={<FcBusiness />}> <Link to="/project">Project</Link> </MenuItem>
            <MenuItem icon={<FcDepartment />}> <Link to="/department">Department</Link> </MenuItem>
            <MenuItem icon={<AiFillNotification />}> <Link to="/noticeboard">Notice Board</Link> </MenuItem>
            <MenuItem icon={<MdOutlineCalendarToday />}> <Link to="/attendance">Attendance</Link> </MenuItem>
            <MenuItem icon={<FcLeave />}> <Link to="/leave">Leave</Link> </MenuItem>
            <MenuItem icon={<AiOutlineFieldTime />}> <Link to="/timesheet">Timesheet</Link> </MenuItem>
            </>
            :
                (userRole=="employee" || userRole=="manager") ?
                <>
                <MenuItem icon={<MdOutlineCalendarToday />}> <Link to="/attendance">Attendance</Link> </MenuItem>
                <MenuItem icon={<FcLeave />}> <Link to="/leave">Leave</Link> </MenuItem>
                <MenuItem icon={<AiOutlineFieldTime />}> <Link to="/timesheet">Timesheet</Link> </MenuItem>
                </>
                :
                <>
                <MenuItem icon={<AiOutlineFieldTime />}> <Link to="/timesheet">Timesheet</Link> </MenuItem>
                </>
          }

          {
            userRole=="admin"?
            <SubMenu title="Recruitment" icon={<RiUserSettingsFill />} >
              <MenuItem ><Link to="/vacancy">Vacancy</Link> </MenuItem>
              <MenuItem ><Link to="/application">Applications</Link> </MenuItem>
            </SubMenu> 
            :
            <></>
          }
          
          
          

        </Menu> 
      

    </ProSidebar>
  );
};

export default SideNavigation;