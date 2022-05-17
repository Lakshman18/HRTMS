import React, {useState, useEffect,useContext} from 'react';
import Pagination from '../../common/Pagination';
import Breadcrumb from '../../common/Breadcrumb'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import Paginate from '../../utils/Paginate';
import * as IoIcons from 'react-icons/io';
import * as AiIcons from 'react-icons/ai';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import { IconContext } from 'react-icons/lib';
import { CSVLink } from "react-csv";
import { Button, Modal, Form, Badge } from 'react-bootstrap';
import { UserContext } from "../../Context";
import {ToastContainer, toast} from 'react-toastify'


const Timesheet = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [myData, setMYData] = useState([]);
    const [othersData, setOthersData] = useState([]);
    const [projectData, setProjectDataData] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState([]);    
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [showMyrows, setShowMyrows] = useState(true);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [employee, setEmployee] = useState('');
    const [project, setproject] = useState('');
    const [date, setDate] = useState('');
    
    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + "/timesheet", { params: { token: token } });
            if(response.data.status_code===200){
                console.log(response.data.message)
                setMYData(response.data.message.my_timesheet)
                setOthersData(response.data.message.others_timesheet)    
                setProjectDataData(response.data.message.my_project)            

                if(showMyrows == false){
                    setFiltered(response.data.message.others_timesheet)
                    setData(response.data.message.others_timesheet)
                }
                else{
                    setFiltered(response.data.message.my_timesheet)
                    setData(response.data.message.my_timesheet)
                }
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

    const handleAddShow = () => setAddShow(true);
    
    const handleEditShow = (id) => {
        setEditShow(true); 
        let record = data.filter(item=> item.id === parseInt(id)); 
        setSelectedRecord(record[0]);
    };
    
    const handleDeleteShow = (item) => {
        setDeleteShow(true)
        setSelectedRecord(item)
    }
    const handleModalClose = () => {setEditShow(false); setShowModalSelectedRow(false); setAddShow(false) ; setSelectedRecord([]) ;setDeleteShow(false) ; };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    project : e.target.project.value,
                    startTime : e.target.startTime.value,
                    endTime :e.target.endTime.value,
                    activity : e.target.activity.value
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/timesheet', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                getData()
                toast.success(response.message);
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){      
            toast.error("Failed to add new project");
        }         
        setAddShow(false);        
    };

    const handleEditSubmit = async(e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    id:selectedRecord.id,
                    project : e.target.project.value,
                    startTime : e.target.startTime.value,
                    endTime :e.target.endTime.value,
                    activity : e.target.activity.value,
                    employee_email:user
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/timesheet', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                getData()
                toast.success(response.message);
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){   
            console.log(error)   
            toast.error("Failed to edit project");
        }
        setEditShow(false);          
    };  

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'DELETE',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    id:selectedRecord.id,
                    employee_email : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/timesheet', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                getData()                
                toast.success(response.message);
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){      
            toast.error("Failed to edit leave");
        }
        setDeleteShow(false); 
    };

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

        if(column=='employee' ){
            setEmployee(res)
            filteredARR = filteredARR.filter(timesheet => timesheet.employee_First_name.toLowerCase().includes(res)  || 
                                            timesheet.employee_Last_name.toLowerCase().includes(res)   );
            setFiltered(filteredARR)
        }

        if(column=='project' ){
            setproject(res)
            filteredARR = filteredARR.filter(timesheet => timesheet.project_name.toLowerCase().includes(res) );
            setFiltered(filteredARR)
        }

        if(column=='date' ){
            setDate(res)
            let newDate = new Date(res)
            filteredARR = filteredARR.filter(timesheet  => new Date(timesheet.date) > newDate  );
            setFiltered(filteredARR)
        }

        // ************************************Other columns Filter*********************

        if(employee != "" && column!='employee'){
            filteredARR = filteredARR.filter(timesheet => timesheet.employee_First_name.toLowerCase().includes(employee)  || 
                                            timesheet.employee_Last_name.toLowerCase().includes(employee)   );
            setFiltered(filteredARR)   
        }

        if(project != "" && column!='project'){
            filteredARR = filteredARR.filter(timesheet => timesheet.project_name.toLowerCase().includes(project)  );
            setFiltered(filteredARR)   
        }

        if(date != "" && column!='date'){
            let newDate = new Date(date)
            filteredARR = filteredARR.filter(timesheet => new Date(timesheet.date) > newDate  );
            setFiltered(filteredARR)
        }
    }

    const resetFilter = (e) =>{
        setFiltered(data)
        setEmployee('')
        setproject('')
        setDate('')
    }
    
    let leaves = Paginate(filtered, currentPage, pageSize)

    const showSelectedRow = (item) => {
        setShowModalSelectedRow(true)
        setSelectedRecord(item)
    }

    const showResults = () =>{
        if(showMyrows == false){
            setFiltered(myData)
            setData(myData)
        }
        else{
            setFiltered(othersData)
            setData(othersData)
        }
        setEmployee('')
        setproject('')
        setDate('')
        setShowMyrows(!showMyrows)
    }

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
                                {
                                    userRole==="admin" || userRole==="manager"
                                    ?
                                    <>
                                    <Button  variant="primary" className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={() =>showResults()}><HiIcons.HiViewList />{showMyrows?"Others Timesheet":"My Timesheet"}</Button > 
                                    <Button type="button " className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Add Timesheet</Button>
                                    </>
                                    :
                                    <Button type="button " className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Add Timesheet</Button>
                                }
                                <CSVLink data={filtered} filename="Timesheet"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                            </IconContext.Provider>       
                        </div>
                    </div>
                    
                    <MDBTable >
                    <MDBTableHead color="info-color" textWhite>
                        <tr>
                            <th style={{width:"5%"}}>#</th>
                            <th style={{width:"15%"}}>Employee</th>
                            <th style={{width:"15%"}}>Date</th>
                            <th style={{width:"15%"}}>Project Name</th>
                            <th style={{width:"25%"}}>Activity</th>
                            <th style={{width:"5%"}}>Start Time</th>
                            <th style={{width:"5%"}}>End Time</th>
                            <th style={{width:"15%"}}>Action</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                            <tr style={{backgroundColor:"#33B5E5"}} >
                                <td ></td>
                                <td><input  onChange={(e)=>{filter(e,'employee');}} value={employee} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input  onChange={(e)=>{filter(e,'date');}} value={date} style={{height:"25px"}} type="date"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input  onChange={(e)=>{filter(e,'project');}} value={project} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td></td>
                                <td></td>
                                <td></td>                              
                                <td >
                                    <Button variant="secondary" onClick={resetFilter} className="mt-0 pt-1 pb-1" style={{fontSize:"12px"}}   size="sm">
                                    RESET
                                    </Button>
                                </td>
                            </tr>
                        {                            
                            leaves.map(item =>
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.employee_First_name +' ' + item.employee_Last_name}</td>
                                    <td>{item.date}</td>
                                    <td>{item.project_name}</td>
                                    <td>{item.activity}</td>
                                    <td>{item.startTime}</td>
                                    <td>{item.endTime}</td>                                    
                                    <td>
                                        <IconContext.Provider value={{ size: '20', color:"green" }}>
                                        {
                                            showMyrows
                                            ?
                                            <>
                                            <AiIcons.AiFillEdit onClick={() => handleEditShow(item.id)} />
                                            <GrIcons.GrView className='ml-3' onClick={() => showSelectedRow(item)} />
                                            </>
                                            :
                                            <GrIcons.GrView className='ml-3' onClick={() => showSelectedRow(item)} />
                                            
                                        }
                                        </IconContext.Provider> 

                                        <IconContext.Provider  value={{ size: '20', color:"red" }}>
                                        {
                                            showMyrows
                                            ?
                                            <>
                                            <AiIcons.AiFillDelete className="ml-3" onClick={() => handleDeleteShow(item)} />
                                            </>
                                            :
                                            <></>                                               
                                        }
                                            
                                        </IconContext.Provider> 
                                    </td>
                                </tr>
                            )
                        }               
                    
                    </MDBTableBody>
                    </MDBTable>

                    <Pagination itemsCount={filtered.length} pageSize={pageSize} onPageChange={handlePageChange} currentPage={currentPage}/>
                </div>
            </div>

            <Modal show={addShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Add Timesheet</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleAddSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >

                                <Form.Label >project Name</Form.Label>
                                <Form.Select name="project" required>
                                    {projectData.map(item=> <option key={item.id} value={item.id}>{item.projectName}</option>)}
                                </Form.Select>  

                                <Form.Label>Start Time</Form.Label>
                                <Form.Control type="time"  name="startTime" required/>  

                                <Form.Label>End Time</Form.Label>
                                <Form.Control type="time"  name="endTime" required/>      

                                <Form.Label>Activity</Form.Label>
                                <Form.Control type="textbox"  name="activity" required/>                                             

                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose}  size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit"  size="md" >
                            Save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>

            <Modal show={editShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Edit Timesheet</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label>Project Name</Form.Label>
                                <Form.Select disabled name="project" required defaultValue={selectedRecord.project}>
                                    {projectData.map(item=> <option key={item.id} value={item.id}>{item.projectName}</option>)}
                                </Form.Select>  

                                <Form.Label>Date</Form.Label>
                                <Form.Control disabled type="date"  name="date" required defaultValue={selectedRecord.date}/>  

                                <Form.Label>Start Time</Form.Label>
                                <Form.Control type="time"  name="startTime" required defaultValue={selectedRecord.startTime}/>  

                                <Form.Label>End Time</Form.Label>
                                <Form.Control type="time"  name="endTime" required defaultValue={selectedRecord.endTime}/>      

                                <Form.Label>Activity</Form.Label>
                                <Form.Control type="textbox"  name="activity" required defaultValue={selectedRecord.activity}/>                                       
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose}  size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit"  size="md">
                            Save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>   

            <Modal show={showModalSelectedRow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title >{selectedRecord.date}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                        <div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Employee Name</div>
                            <div className='col'> : {selectedRecord.employee_First_name +' ' + selectedRecord.employee_Last_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Date</div>
                            <div className='col'> : {selectedRecord. date}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Project</div>
                            <div className='col'> : {selectedRecord. project_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Start Time</div>
                            <div className='col'> : {selectedRecord.startTime}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>end Time</div>
                            <div className='col'> : {selectedRecord.endTime}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Activity</div>
                            <div className='col'> : {selectedRecord.activity}</div>
                        </div><br />
                        
                    </Modal.Body>
                    <Modal.Footer className=' d-flex justify-content-center'>                        
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                    </Modal.Footer>
            </Modal>  

            <Modal show={deleteShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title >{selectedRecord.date}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                        <div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Employee Name</div>
                            <div className='col'> : {selectedRecord.employee_First_name +' ' + selectedRecord.employee_Last_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Date</div>
                            <div className='col'> : {selectedRecord. date}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Project</div>
                            <div className='col'> : {selectedRecord. project_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Start Time</div>
                            <div className='col'> : {selectedRecord.startTime}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>end Time</div>
                            <div className='col'> : {selectedRecord.endTime}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Activity</div>
                            <div className='col'> : {selectedRecord.activity}</div>
                        </div><br />
                    </Modal.Body>
                    <Modal.Footer className=' d-flex justify-content-center'>                        
                        <Button variant="danger" onClick={handleDeleteSubmit} size="md">
                            Delete
                        </Button>
                    </Modal.Footer>
            </Modal> 
   
        </React.Fragment>
    );
}
 
export default Timesheet;