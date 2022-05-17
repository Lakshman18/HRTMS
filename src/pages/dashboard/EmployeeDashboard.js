import React, {useState, useEffect, useContext} from 'react';
import './Dashboard.css';
import * as FaIcons from 'react-icons/fa';
import * as FcIcons from 'react-icons/fc';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md'; 
import { IconContext } from 'react-icons/lib';
import { MDBDataTable  } from 'mdbreact';
import { BarChart, Bar,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ToggleButton from 'react-toggle-button';
import { Button, Modal, Form, Badge, Card } from 'react-bootstrap';
import { UserContext } from "../../Context";
import {ToastContainer, toast} from 'react-toastify'


const EmployeeDashboard = () => {

  const [dashboarddata, setDashboarddata] = useState([])
  const [noticeData, setNoticeData] = useState([])
  const [birthdayData, setBirthdayData] = useState([])
  const [weeklyAttendance, setWeeklyAttendance] = useState([])
  const [checkIN, setcheckIN] = useState(false);  
  const [checkOut, setcheckOut] = useState(false);
  const [checkINTime, setcheckINTime] = useState();  
  const [checkOutTime, setcheckOutTime] = useState();
  const [user, token] = useContext(UserContext);
  const axios = require('axios'); 

  const data1 = [
  {
    name: 'Monday',
    total: 9,
    worked: 7,
  },
  {
    name: 'Tuesday',
    total: 9,
    worked: 6,
  },
  {
    name: 'Wednesday',
    total: 9,
    worked: 7,
  },
  {
    name: 'Thursday',
    total: 9,
    worked: 9,
  },
  {
    name: 'Friday',
    total: 9,
    worked: 8,
  }
];

useEffect(() => {  
  getData()
}, [])

  const getData = async(e) =>{
      try{
          const response = await axios.get(process.env.REACT_APP_APIURL + '/dashboard', { params: { token: token } });
          if(response.data.status_code===200){
            console.log(response.data.message)
              setDashboarddata(response.data.message)
              setNoticeData(response.data.message.notice)
              birthdayFunction(response.data.message.employee_birthday)
              setWeeklyAttendance(response.data.message.weekly_attendance)              
              setcheckINTime(response.data.message.today_my_attendance['inTime'])
              setcheckOutTime(response.data.message.today_my_attendance['outTime'])

              if(response.data.message.today_my_attendance['inTime'] !=null ){
                setcheckIN(true)
              }
              if(response.data.message.today_my_attendance['outTime'] !=null ){
                setcheckOut(true)
              }
          }
          else{
              setDashboarddata([])
              toast.error(response.data.message);
          }
      } 
      catch(error){
        console.log(error)      
        toast.error("Failed to fetch");
      }            
  }

  const handleAttendance = async(e) =>{
    if(checkIN == false  && checkOut == false){      
      e.preventDefault();
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    employee_email : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/attendance', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                getData()
                setcheckIN(!checkIN)
                toast.success(response.message);
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){      
            toast.error("Failed to Check In");
        }         
    }
    if(checkOut == false && checkIN == true){      
      try{
        const requestOptions = {
            method: 'PUT',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                token: token ,
                employee_email : user,
            })
        };
        let response = await fetch(process.env.REACT_APP_APIURL + '/attendance', requestOptions)
        response = await response.json();  

        if(response.status_code===200){
            getData()
            setcheckOut(!checkOut)
            toast.success(response.message);
        }
        else{
            toast.error(response.message);
        }    
    }    
    catch(error){      
        toast.error("Failed to Check In");
    }         
    }
  }

  const nth = function(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  const birthdayFunction = (birthdayData) =>{
    setBirthdayData(
      birthdayData.map(item=>{    
        const current_year = new Date().getFullYear()
        var mydate = new Date(item['dob']);
        mydate = mydate.toDateString().split(' ')
        let temp = mydate[2] + nth(mydate[2])
        mydate[2] = mydate[1]
        mydate[1] = temp 
        mydate[3] = current_year 
        mydate = mydate.join(' ')
        item['dob']=mydate.toString()
        return item
      })
    )       
  }

  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
      return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{`${value} hr`}</text>;
  };

 

  return (
    <React.Fragment>
      <div style={{backgroundColor:"#f5f5f5"}}>

        <IconContext.Provider value={{ size: '70' }}>
          <div className="container-fluid pl-4 pr-4 pt-5">
            <div className="row">
            <div className="col-md-4">
              <div className="card-counter primary" >                
                <FaIcons.FaUserCog  />
                {/* <i className="fa fa-code-fork"></i> */}
                <span className="count-numbers">{dashboarddata['total_employees']}</span>
                <span className="count-name">Total Employees</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-counter success">
                <AiIcons.AiFillProject />
                <span className="count-numbers">{dashboarddata['my_project']}</span>
                <span className="count-name">Projects Assigned</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-counter danger">
                <FcIcons.FcLeave  />
                <span className="count-numbers">{dashboarddata['total_leave']}</span>
                <span className="count-name">Available Leaves</span>
              </div>
            </div>
            </div>
          </div>
        </IconContext.Provider>

        <div className='row mt-5 mr-4 ml-4'>          
          <div className="col-lg-6 mt-4" style={{backgroundColor:"#FFFFFF"}}>
            <div className="pt-3" >
                <p className="font-weight-bold text-center">Weekly Working Hours</p>
                <hr></hr>
                
                <ResponsiveContainer width="100%" height={400}>                
                  <BarChart width={600} height={300} data={weeklyAttendance}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Bar dataKey="worked_hours" barSize={30} fill="#b69efe"
                      label={renderCustomBarLabel}
                      />
                  </BarChart>        
                </ResponsiveContainer>
            </div>
          </div>

          <div  className="col-lg-5 mt-4 ml-auto " style={{backgroundColor:"#FFFFFF"}}>        
          <div className="pt-3" >
              <p className="font-weight-bold text-center">Mark Your Attendance</p>
                <hr></hr>
                <div className="mt-4" hidden={false}> 
                  <div className='row d-flex justify-content-center'>
                    <div className='col-md-10 '>
                        <Card style={{ width: '100%'}} className="attendance" onClick={handleAttendance} disabled={true}>
                          <Card.Body>
                            <Card.Title className=' d-flex justify-content-center'>{checkIN ? checkOut ? 'Attendance Marked' :'Check Out' : 'Check In'}</Card.Title>
                            <Card.Text className=' d-flex justify-content-center'>
                              <IconContext.Provider value={{ size: '50' }}>
                                {checkIN ? checkOut ? <MdIcons.MdOutlineDownloadDone /> : <RiIcons.RiLogoutCircleFill /> : <RiIcons.RiLoginCircleFill /> }                                                              
                              </IconContext.Provider>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                    </div>
                  </div>

                  <div className='row mt-3'>
                    <div className='col d-flex justify-content-center fw-bold'>
                      Checked In Time
                    </div>
                    <div className='col '>
                      : {checkINTime? checkINTime.slice(0,8): "-"}
                    </div>
                  </div>

                  <div className='row mt-3 mb-3'>
                    <div className='col d-flex justify-content-center fw-bold'>
                      Checked Out Time
                    </div>
                    <div className='col'>
                      : {checkOutTime? checkOutTime: "-"}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>


        <div className='row mt-5 mr-4 ml-4 '>
          <div  className="col-lg-6 mt-4 " style={{backgroundColor:"#FFFFFF"}}>        
            <div className="pt-3" >
              <p className="font-weight-bold text-center">Upcomming Birthdays</p>
              <hr></hr>

              {birthdayData.map(item=>{                 
                 return <div key={item.id}>
                   <div className="row" > 
                     <div className='col-2'>
                       <img src="/images/avatar.png" style={{ width: '50px', height: '50px' }}alt=""  className='rounded-circle'/>
                     </div>
                     <div className='col-10'>
                       <p className="">{item.firstName} {item.lastName}</p>
                       <p style={{color:"grey", marginTop:"-20px", fontSize:"14px"}}> {item.dob}</p>
                       <p style={{color:"grey", fontFamily:"Courier New"}}>Wish Him on {item.dob}</p>                  
                     
                     </div>
                   </div>
                   <hr></hr> 
                 </div>
              })}
            </div>
          </div>

          <div  className="col-lg-5 mt-4 ml-auto " style={{backgroundColor:"#FFFFFF" }}>        
            <div className="pt-3" >
              <p className="font-weight-bold text-center">Notice Board</p>
              <hr></hr>

              {noticeData.map(item=>{                 
                 return <div key={item.id}>
                  <div className="row" > 
                    <div className='col-2'>
                      <img src="/images/notice.png" style={{ width: '50px', height: '50px' }}alt=""  className=''/>
                    </div>
                    <div className='col-10'>
                      <p className="">{item.noticeTitle}</p>
                      <p style={{color:"grey", marginTop:"-20px", fontSize:"14px"}}>{item.description}</p>
                      <button type="button" className="btn-sm btn-warning">View</button> 
                    </div>
                  </div>
                  <hr></hr> 
                </div>
                            
              })}
              
            </div>
          </div>
        </div>


      </div>

    </React.Fragment>
  );
};

export default EmployeeDashboard;