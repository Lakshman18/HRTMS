import React, {useState, useEffect, useContext} from 'react';
import Pagination from '../../common/Pagination';
import Breadcrumb from '../../common/Breadcrumb'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import Paginate from '../../utils/Paginate';
import * as HiIcons from 'react-icons/hi';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import { CSVLink } from "react-csv";
import { Button } from 'react-bootstrap';
import { UserContext } from "../../Context";
import {toast} from 'react-toastify'

const Attendance = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [myData, setMYData] = useState([]);
    const [othersData, setOthersData] = useState([]);
    const [showMyrows, setShowMyrows] = useState(true);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + "/attendance", { params: { token: token } });
            console.log(response.data.message)
            if(response.data.status_code===200){
                setMYData(response.data.message.my_attendance)
                setOthersData(response.data.message.others_attendance)
                setFiltered(response.data.message.my_attendance)
                setData(response.data.message.my_attendance)
            }
            else{
                setFiltered([])
                setData([])
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

    const filter = (e, column) =>{
        let res = e.target.value.toLowerCase()

        let filteredARR = [];

        setFiltered(data);
        filteredARR = data;

        if(currentPage>1){
            setCurrentPage(1)
        }

        if(column=='name' ){
            setName(res)
            filteredARR = filteredARR.filter(attendance => attendance.employee_First_name.toLowerCase().includes(res)  || 
                                            attendance.employee_Last_name.toLowerCase().includes(res)   );
            setFiltered(filteredARR)
        }

        if(column=='date' ){
            setDate(res)
            let newDate = new Date(res)
            filteredARR = filteredARR.filter(attendance  => new Date(attendance.date) > newDate  );
            setFiltered(filteredARR)
        }

        // ************************************Other columns Filter*********************

        if(name != "" && column!='name'){
            filteredARR = filteredARR.filter(attendance => attendance.employee_First_name.toLowerCase().includes(name)  || 
                                            attendance.employee_Last_name.toLowerCase().includes(name)   );
            setFiltered(filteredARR)   
        }

        if(date != "" && column!='date'){
            let newDate = new Date(date)
            filteredARR = filteredARR.filter(attendance => new Date(attendance.date) > newDate  );
            setFiltered(filteredARR)
        }
    }

    const resetFilter = (e) =>{
        setFiltered(data)
        setName('')
        setDate('')
    }
    
    let attendance = Paginate(filtered, currentPage, pageSize)

    const changeResults = () =>{
        if(showMyrows == false){
            setFiltered(myData)
            setData(myData)
        }
        else{
            setFiltered(othersData)
            setData(othersData)
        }
        setName('')
        setDate('')
        setShowMyrows(!showMyrows)
    }

    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Attendance"/>
                </div>

                {data.length>=0
                ? 
                    <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <h6 className="font-weight-bold pt-3">Attendance</h6>
                            </div>
                            <div className='col justify-content-end '>
                                <IconContext.Provider value={{ size: '30' }}>
                                {
                                    userRole==="admin" || userRole==="manager"?
                                    <Button  variant="primary" className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={() =>changeResults()}><HiIcons.HiViewList />{showMyrows?"Others Attendance":"My Attendance"}</Button >    
                                    :
                                    <></>
                                }    
                                <CSVLink data={filtered} filename="Attendance"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                                </IconContext.Provider>                              
                            </div>
                        </div>

                        <MDBTable >
                        <MDBTableHead color="info-color" textWhite>
                            <tr>
                                <th style={{width:"10%"}}>#</th>
                                <th style={{width:"30%"}}>Name</th>
                                <th style={{width:"30%"}}>Date</th>
                                <th style={{width:"15%"}}>Check In Time</th>
                                <th style={{width:"15%"}}>Check Out Time</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                                <tr style={{backgroundColor:"#33B5E5"}} >
                                    <td ></td>
                                    <td><input  onChange={(e)=>{filter(e,'name');}} value={name} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                    <td>
                                        <input  onChange={(e)=>{filter(e,'date');}} value={date} style={{ height:"25px"}} type="date"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </td>   
                                    <td></td>                              
                                    <td >
                                        <Button variant="secondary" onClick={resetFilter} className="mt-0 pt-1 pb-1" style={{fontSize:"12px"}}   size="sm">
                                        RESET
                                        </Button>
                                    </td>
                                </tr>
                            {
                                attendance.map(item =>
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.employee_First_name +' ' + item.employee_Last_name}</td>
                                        <td>{item.date}</td>
                                        <td>{item.inTime.substring(0, 8)}</td>
                                        <td>{item.outTime}</td>
                                    </tr>
                                )
                            }               
                        
                        </MDBTableBody>
                        </MDBTable>

                        <Pagination itemsCount={filtered.length} pageSize={pageSize} onPageChange={handlePageChange} currentPage={currentPage}/>
                    </div>
                :
                    <div></div>
                }
            </div>
        </React.Fragment>
    );
}
 
export default Attendance;