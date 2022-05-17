import React, {useState, useEffect,useContext} from 'react';
import Pagination from '../../common/Pagination';
import Breadcrumb from '../../common/Breadcrumb'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import Paginate from '../../utils/Paginate';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import { CSVLink } from "react-csv";
import { Button, Modal, Form, Badge } from 'react-bootstrap';
import { UserContext } from "../../Context";
import {ToastContainer, toast} from 'react-toastify'


const ClientTimeSheet = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [showMyrows, setShowMyrows] = useState(true);
    const [user, token, userRole, pageSize] = useContext(UserContext);;
    const axios = require('axios');
    
    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + "/timesheet", { params: { token: token } });
            if(response.data.status_code===200){
                console.log(response.data.message)
                setData(response.data.message.my_timesheet)
                setFiltered(response.data.message.my_timesheet)
            }
            else{
                setData([])
                setFiltered([])
                toast.error(response.data.message);
            }
        } 
        catch(error){      
            toast.error("Failed to fetch");
        }            
    }

    const handlePageChange= (page) => {
        setCurrentPage(page)
    }

    const filter = (e) =>{
        const res = e.target.value.toLowerCase()
        
        if(res){
            let  timesheets1 = data.filter( timesheet => 
                                                        timesheet.activity.toLowerCase().includes(res) ||  
                                                        timesheet.project_name.toLowerCase().includes(res) ||  
                                                        timesheet.date.toLowerCase().includes(res) );
            setFiltered( timesheets1)

            if( timesheets1.length <= pageSize){
                setCurrentPage(1)
            }            
        }
        else{
            setFiltered(data)
        }
    }
    
    let leaves = Paginate(filtered, currentPage, pageSize)

    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="TimeSheet"/>
                </div>

                <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                    <div className='row mb-3'>
                        <div className='col-3'>
                            <h6 className="font-weight-bold pt-3">TimeSheet</h6>
                        </div>
                        <div className='col justify-content-end '>
                            <IconContext.Provider value={{ size: '30' }}>                                
                                <CSVLink data={filtered} filename="Timesheet"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                            </IconContext.Provider>       
                        </div>
                    </div>

                    <div style={{width:"25%", float:"right"}}>
                        <div className="input-group input-group-sm mb-3">
                           <span className="input-group-text" id="inputGroup-sizing-sm">Search</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={filter}/>
                        </div>
                    </div>

                    
                    <MDBTable >
                    <MDBTableHead color="info-color" textWhite>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Project Name</th>
                            <th>Activity</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {                            
                            leaves.map(item =>
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.date}</td>
                                    <td>{item.project_name}</td>
                                    <td>{item.activity}</td>  
                                </tr>
                            )
                        }               
                    
                    </MDBTableBody>
                    </MDBTable>

                    <Pagination itemsCount={filtered.length} pageSize={pageSize} onPageChange={handlePageChange} currentPage={currentPage}/>
                </div>
            </div> 

   
        </React.Fragment>
    );
}
 
export default ClientTimeSheet;