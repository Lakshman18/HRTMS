import React, {useState, useEffect,useContext} from 'react';
import './Dashboard.css';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md'; 
import * as RiIcons from 'react-icons/ri';
import { IconContext } from 'react-icons/lib';
import { MDBDataTable  } from 'mdbreact';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from 'react-bootstrap';
import { UserContext } from "../../Context";
import { toast} from 'react-toastify'
import  { useNavigate    } from 'react-router-dom'

const Dashboard = () => {

  const [dashboarddata, setDashboarddata] = useState([])
  const [todayPresentEmployees, setTodayPresentEmployees] = useState([])
  const [noticeData, setNoticeData] = useState([])
  const [birthdayData, setBirthdayData] = useState([])
  const [last_30days_presentData, setLast_30days_presentData] = useState([])
  const [checkIN, setcheckIN] = useState(false);  
  const [checkOut, setcheckOut] = useState(false);
  const [checkINTime, setcheckINTime] = useState();  
  const [checkOutTime, setcheckOutTime] = useState();
  const [yaxisdata, setYaxisdata] = useState()
  const [user, token, userRole] = useContext(UserContext);
  const axios = require('axios');
  const navigate  = useNavigate ();

  const data = {
    columns: [
      {
        label: 'Name',
        field: 'fullName',
        sort: 'asc',
        width: 270
      },
      {
        label: 'In Time',
        field: 'inTime',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Out Time',
        field: 'outTime',
        sort: 'asc',
        width: 100
      }
    ],
    rows: todayPresentEmployees
  };

  useEffect(() => {
    getData()
    console.log(userRole)
  }, [])

  const getData = async(e) =>{
      try{
          const response = await axios.get(process.env.REACT_APP_APIURL + '/dashboard', { params: { token: token } });
          if(response.data.status_code===200){
            console.log(response.data.message)
              setDashboarddata(response.data.message)
              setNoticeData(response.data.message.notice)
              birthdayFunction(response.data.message.employee_birthday)
              todayEmployeeDetails(response.data.message.today_employees)              
              setcheckINTime(response.data.message.today_my_attendance['inTime'])
              setcheckOutTime(response.data.message.today_my_attendance['outTime'])
              setLast_30days_presentData(response.data.message.last_30days_present) 

              if(response.data.message.today_my_attendance['inTime'] !=null ){
                setcheckIN(true)
              }
              if(response.data.message.today_my_attendance['outTime'] !=null ){
                setcheckOut(true)
              }

              let max = 0;
              let yaxisArr = [];
              response.data.message.last_30days_present.map(item=>{
                if(max< item.total){
                  max=item.total
                }
              }
              )
              for(let i=0; i<max+1; i++){
                yaxisArr.push(i)
              }
              setYaxisdata(yaxisArr)
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
        toast.error("Failed to Check Out");
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

  const todayEmployeeDetails = (empData) =>{
    setTodayPresentEmployees(
      empData.map(item=>{    
        item['fullName'] = item['employee_First_name'] +" " + item['employee_Last_name']
        item['inTime'] = item['inTime'].slice(0, 8);
        return item
      })
    )       
  }


  return (
    <React.Fragment>
      <div style={{backgroundColor:"#f5f5f5"}}>

        <IconContext.Provider value={{ size: '70' }}>
          <div className="container-fluid pl-4 pr-4 pt-5">
            <div className="row">
            <div className="col-md-3">
              <div className="card-counter primary" >
                <FaIcons.FaUserCog  />
                {/* <i className="fa fa-code-fork"></i> */}
                <span className="count-numbers">{dashboarddata['total_employees']}</span>
                <span className="count-name">Total Employees</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card-counter danger">
                <FaIcons.FaUserCheck />
                <span className="count-numbers">{dashboarddata['today_present_employees']}</span>
                <span className="count-name">Today's Presents</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card-counter success">
                <FaIcons.FaUserSlash />
                <span className="count-numbers">{dashboarddata['today_absent_employees']}</span>
                <span className="count-name">Today's Absents</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card-counter info">
                <FaIcons.FaUserClock />
                <span className="count-numbers">{dashboarddata['today_leave_employees']}</span>
                <span className="count-name">Today's Leave</span>
              </div>
            </div>
            </div>
          </div>
        </IconContext.Provider>

        <div className='row mt-5 mr-4 ml-4'>
          <div  className="col-lg-6 mt-4" style={{backgroundColor:"#FFFFFF"}}>        
            <div className="pt-3" >
              <p className="font-weight-bold text-center">Attendance (Last 30 Days)</p>
              <hr></hr>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart width={550} height={300} data={last_30days_presentData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="total" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="date" tick={true}  />
                  <YAxis  label={"Count"} ticks={yaxisdata} />
                  <Tooltip />
                </LineChart>          
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

        <div className="mt-5 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
          <h6 className="font-weight-bold pt-3">Today Attendance</h6>
          <MDBDataTable
          striped
          bordered
          small
          data={data}
        />
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

export default Dashboard;