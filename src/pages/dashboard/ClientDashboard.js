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


const ClientDashboard = () => {

  const [projectData, setProjectData] = useState([])
  const [projectTotal, setProjectTotal] = useState()
  const [user, token, userRole] = useContext(UserContext);
  const axios = require('axios'); 

  useEffect(() => {
    getData()
    console.log(userRole)
  }, [])

  const getData = async(e) =>{
      try{
          const response = await axios.get(process.env.REACT_APP_APIURL + '/dashboard', { params: { token: token } });
          if(response.data.status_code===200){
            console.log(response.data.message)
            setProjectTotal(response.data.message.my_project)
            setProjectData(response.data.message.my_project_details)
          }
          else{
            console.log(response.data.message)
              toast.error(response.data.message);
          }
      } 
      catch(error){
        console.log(error)      
        toast.error("Failed to fetch");
      }            
  }

  const data = {
    columns: [
    {
        label: 'Id',
        field: 'id',
        sort: 'asc',
        width: 270
        },
      {
        label: 'Project Name',
        field: 'projectName',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Start Date',
        field: 'startDate',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Renewal Date',
        field: 'renewalDate',
        sort: 'asc',
        width: 100
      }
    ],
    rows: projectData
  };


  return (
    <React.Fragment>
    <div style={{backgroundColor:"#f5f5f5"}}>

        <IconContext.Provider value={{ size: '70' }}>
        <div className="container-fluid pl-4 pr-4 pt-5">
            <div className="row">
                <div className="col-md-3">
                    <div className="card-counter primary" >
                        <AiIcons.AiFillProject  />
                        {/* <i className="fa fa-code-fork"></i> */}
                        <span className="count-numbers">{projectTotal}</span>
                        <span className="count-name">Total Projects</span>
                    </div>
                </div>
            </div>
        </div>
        </IconContext.Provider>

        <div className="mt-5 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
        <h6 className="font-weight-bold pt-3">Project Details</h6>
        <MDBDataTable
        striped
        bordered
        small
        data={data}
        />
        </div>
       
    </div>

    </React.Fragment>
  );
};

export default ClientDashboard;