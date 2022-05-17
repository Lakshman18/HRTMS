import React, {useState, useEffect, useContext} from 'react';
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
import { Button, Modal, Form, Badge, Card } from 'react-bootstrap';
import './leave.css';
import { UserContext } from "../../Context";
import {toast} from 'react-toastify'

const Leave = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);  
    const [myLeaveCount, setMyLeaveCount] = useState([]);  
    const [myData, setMYData] = useState([]);
    const [othersData, setOthersData] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState([]);    
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [showMyrows, setShowMyrows] = useState(true);    
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [name, setName] = useState('');
    const [leaveFrom, setLeaveFrom] = useState('');
    const [leaveTo, setLeaveTo] = useState('');
    const [status, setStatus] = useState('-');

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + "/leave", { params: { token: token } });
            if(response.data.status_code===200){
                console.log(response.data.message)
                setMYData(response.data.message.my_leave_data)
                setMyLeaveCount(response.data.message.my_leave_count)
                setOthersData(response.data.message.others_leave)
                
                if(showMyrows == false){
                    setFiltered(response.data.message.others_leave)
                    setData(response.data.message.others_leave)
                }
                else{
                    setFiltered(response.data.message.my_leave_data)
                    setData(response.data.message.my_leave_data)
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
        setCurrentPage(1)           
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
                    leaveFromDate : e.target.leaveFromDate.value,
                    leaveToDate : e.target.leaveToDate.value,
                    reason : e.target.reason.value,
                    employee_email : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/leave', requestOptions)
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
            toast.error("Failed to apply leave");
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
                    status : e.target.status.value,
                    modifiedBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/leave', requestOptions)
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
            let response = await fetch(process.env.REACT_APP_APIURL + '/leave', requestOptions)
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
            toast.error("Failed to delete leave");
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

        if(column=='name' ){
            setName(res)
            filteredARR = filteredARR.filter( leave =>  leave.employee_First_name.toLowerCase().includes(res)  || 
                                             leave.employee_Last_name.toLowerCase().includes(res)   );
            setFiltered(filteredARR)
        }

        if(column=='leaveFrom' ){
            setLeaveFrom(res)
            let newDate = new Date(res)
            filteredARR = filteredARR.filter(leave  => new Date(leave.leaveFromDate) > newDate  );
            setFiltered(filteredARR)
        }

        if(column=='leaveTo' ){
            setLeaveTo(res)
            let newDate = new Date(res)
            filteredARR = filteredARR.filter(leave  => new Date(leave.leaveToDate) < newDate  );
            setFiltered(filteredARR)
        }

        if(column=='status' ){
            setStatus(res)
            filteredARR = filteredARR.filter( leave =>  leave.status.toLowerCase().includes(res)  );
            setFiltered(filteredARR)
        }

        // ************************************Other columns Filter*********************

        if(name != "" && column!='name'){
            filteredARR = filteredARR.filter( leave =>  leave.employee_First_name.toLowerCase().includes(name)  || 
                                             leave.employee_Last_name.toLowerCase().includes(name)   );
            setFiltered(filteredARR)   
        }

        if(leaveFrom != "" && column!='leaveFrom'){
            let newDate = new Date(leaveFrom)
            filteredARR = filteredARR.filter(leave  => new Date(leave.leaveFromDate) > newDate  );
            setFiltered(filteredARR)   
        }

        if(leaveTo != "" && column!='leaveTo'){
            let newDate = new Date(leaveTo)
            filteredARR = filteredARR.filter(leave  => new Date(leave.leaveFromDate) < newDate  );
            setFiltered(filteredARR)   
        }

        if(status != "" && column!='status'){
            filteredARR = filteredARR.filter( leave =>  leave.status.toLowerCase().includes(status) );
            setFiltered(filteredARR)
        }
    }

    const resetFilter = (e) =>{
        setFiltered(data)
        setName('')
        setLeaveFrom('')
        setLeaveTo('')
        setStatus('-')
    }

    
    let leaves = Paginate(filtered, currentPage, pageSize)

    const showSelectedRow = (item) => {
        setShowModalSelectedRow(true)
        setSelectedRecord(item)
    }

    const changeResults = () =>{
        if(showMyrows == false){
            setFiltered(myData)
            setData(myData)
        }
        else{
            setFiltered(othersData)
            setData(othersData)
        }
        
        setShowMyrows(!showMyrows)
    }


    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Leave"/>
                </div>

                
                    <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                        <div className='row mb-3'>
                            <div className='col-3'>
                                <h6 className="font-weight-bold pt-3">Leave</h6>
                            </div>
                            <div className='col justify-content-end ' >
                                
                            </div>
                        </div>

                        <div className='row mb-3 d-flex justify-content-center'>
                        <div className='col-md-4 mb-1'>
                            <Card style={{ width: '100%' }} className="leave">
                                <Card.Body>
                                <Card.Title className=' d-flex justify-content-center'>Annual Leave</Card.Title>
                                <Card.Text className=' d-flex justify-content-center fw-bold' style={{fontSize:"20px"}}>
                                {myLeaveCount.availableAnnualLeave}
                                </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className='col-md-4 mb-1 '>
                            <Card style={{ width: '100%' }} className="leave">
                                <Card.Body>
                                <Card.Title className=' d-flex justify-content-center'>Casual Leave</Card.Title>
                                <Card.Text className=' d-flex justify-content-center fw-bold' style={{fontSize:"20px"}}>
                                    {myLeaveCount.availableCasualLeave}
                                </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className='col-md-4 mb-1'>
                            <Card style={{ width: '100%' }} className="leave">
                                <Card.Body>
                                <Card.Title className=' d-flex justify-content-center'>Sick Leave</Card.Title>
                                <Card.Text className=' d-flex justify-content-center fw-bold' style={{fontSize:"20px"}}>
                                {myLeaveCount.availableSickLeave}
                                </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        </div>

                        <div className='row mb-3'>
                            <div className='col-3'>
                                <h6 className="font-weight-bold pt-3"></h6>
                            </div>
                            <div className='col justify-content-end ' >
                                <IconContext.Provider value={{ size: '30' }}> 
                                    {
                                        userRole==="admin" || userRole==="manager"
                                        ?
                                        <>
                                        <Button  variant="primary" className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={() =>changeResults()}><HiIcons.HiViewList />{showMyrows?"Others Leave":"My Leave"}</Button >  
                                        <Button type="button " className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Apply For Leave</Button> 
                                        </>
                                        :
                                        <Button type="button " className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Apply For Leave</Button>
                                    }
                                    <CSVLink data={filtered} filename="Leave"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                                </IconContext.Provider>       
                            </div>
                        </div>


                        <MDBTable >
                        <MDBTableHead color="info-color" textWhite>
                            <tr>
                            <th>#</th>
                            <th>Emp Name</th>
                            <th>Leave From</th>
                            <th>Leave To</th>
                            <th>days</th>
                            <th>Reason</th>
                            <th>status</th>
                            <th>Action</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            <tr style={{backgroundColor:"#33B5E5"}} >
                                <td ></td>
                                <td><input   onChange={(e)=>{filter(e,'name');}} value={name} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input   onChange={(e)=>{filter(e,'leaveFrom');}} value={leaveFrom} style={{height:"25px"}} type="date"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input   onChange={(e)=>{filter(e,'leaveTo');}} value={leaveTo} style={{height:"25px"}} type="date"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td></td>
                                <td></td>   
                                <td>
                                    <Form.Select style={{height:"30px", fontSize:"12px"}} name="status" onChange={(e)=>{filter(e,'status');}} value={status} required>
                                        <option value="-" hidden default={true}>--</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="pending">Pending</option>
                                    </Form.Select>
                                </td>                              
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
                                        <td>{item.leaveFromDate}</td>
                                        <td>{item.leaveToDate}</td>
                                        <td>{item.days}</td>
                                        <td>{item.reason}</td>
                                        <td>
                                            {item.status === 'approved'? <Badge pill bg="success">Approved</Badge> :
                                            item.status === 'rejected'? <Badge pill bg="danger"> Rejected</Badge> : 
                                            <Badge pill bg="warning"> Pending</Badge>} 
                                        </td>
                                        <td>
                                            <IconContext.Provider value={{ size: '20', color:"green" }}>
                                                {
                                                    (showMyrows ==false && userRole=="manager") || (userRole=="admin")
                                                    ?
                                                    <AiIcons.AiFillEdit onClick={() => handleEditShow(item.id)} />
                                                    :
                                                    <></>
                                                }                                                
                                                <GrIcons.GrView className='ml-3' onClick={() => showSelectedRow(item)} />
                                            </IconContext.Provider> 

                                            <IconContext.Provider  value={{ size: '20', color:"red" }}>
                                                {
                                                    showMyrows ==true 
                                                    ?
                                                    <AiIcons.AiFillDelete className="ml-3" onClick={() => handleDeleteShow(item)} />
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
                <Modal.Title>Apply For Leave</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleAddSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                
                                <Form.Label>Leave From</Form.Label>
                                <Form.Control type="date"  name="leaveFromDate" required/>  

                                <Form.Label>Leave To</Form.Label>
                                <Form.Control type="date"  name="leaveToDate" required/>  

                                <Form.Label >Reason</Form.Label >
                                <Form.Select name="reason" required>
                                    <option value="annual">Annual</option>
                                    <option value="casual"> Casual</option>
                                    <option value="sick">Sick</option>
                                </Form.Select>                                                   

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
                <Modal.Title>Edit Leave</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >                                

                                <Form.Label>Employee Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter  leave name" name="empName" defaultValue={selectedRecord.employee_First_name +' ' + selectedRecord.employee_Last_name} required disabled="True"/>  

                                <Form.Label >Leave From</Form.Label>
                                <Form.Control type="date" placeholder="Enter  leave name" name="leaveFrom" defaultValue={selectedRecord.leaveFromDate} disabled="True" required/>  

                                <Form.Label >Leave To</Form.Label>
                                <Form.Control type="date" placeholder="Enter  leave name" name="leaveFrom" defaultValue={selectedRecord.leaveToDate} disabled="True" required/>  

                                <Form.Label>Days</Form.Label>
                                <Form.Control type="text" placeholder="Enter  leave name" name="days" defaultValue={selectedRecord.days} disabled="True" required />  

                                <Form.Label>Reason</Form.Label>
                                <Form.Control type="text" placeholder="Enter  leave name" name="reason" defaultValue={selectedRecord.reason} disabled="True" required />  

                                <Form.Label >Status</Form.Label >
                                <Form.Select name="status"  defaultValue={selectedRecord.status} required>
                                    <option value="approved">Approve</option>
                                    <option value="rejected">Reject</option>                                    
                                </Form.Select>                                      
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
                <Modal.Title >{selectedRecord.employee_First_name +' ' + selectedRecord.employee_Last_name}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                    <   div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Employee Name</div>
                            <div className='col'> : {selectedRecord.employee_First_name +' ' + selectedRecord.employee_Last_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Leave From</div>
                            <div className='col'> : {selectedRecord.leaveFromDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Leave To</div>
                            <div className='col'> : {selectedRecord.leaveToDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Days</div>
                            <div className='col'> : {selectedRecord.days}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Reason</div>
                            <div className='col'> : {selectedRecord.reason}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Status</div>
                            <div className='col'> : {selectedRecord.status === 'approved'? <Badge pill bg="success">Approved</Badge> :
                                                    selectedRecord.status === 'rejected'? <Badge pill bg="danger"> Rejected</Badge> : 
                                                    <Badge pill bg="warning"> Pending</Badge>} 
                            </div>
                        </div><br />
                        
                        <div className='row'>
                            <div className='col font-weight-bold'>Created Date</div>
                            <div className='col'> : {selectedRecord.createdDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Modified By</div>
                            <div className='col'> : {selectedRecord.modifiedBy}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Modified Date</div>
                            <div className='col'> : {selectedRecord.modifiedDate}</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className=' d-flex justify-content-center'>                        
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                    </Modal.Footer>
            </Modal>  

            <Modal show={deleteShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title >{selectedRecord.employee_First_name +' ' + selectedRecord.employee_Last_name}</Modal.Title>
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
                            <div className='col font-weight-bold'>Leave From</div>
                            <div className='col'> : {selectedRecord.leaveFromDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Leave To</div>
                            <div className='col'> : {selectedRecord.leaveToDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Reason</div>
                            <div className='col'> : {selectedRecord.reason}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Status</div>
                            <div className='col'> : {selectedRecord.status === 'approved'? <Badge pill bg="success">Approved</Badge> :
                                                    selectedRecord.status === 'rejected'? <Badge pill bg="danger"> Rejected</Badge> : 
                                                    <Badge pill bg="warning"> Pending</Badge>} 
                            </div>
                        </div><br />
                    </Modal.Body>
                    <Modal.Footer className=' d-flex justify-content-center'> 
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>                       
                        <Button variant="danger" onClick={handleDeleteSubmit} size="md">
                            Delete
                        </Button>
                    </Modal.Footer>
            </Modal> 
   
        </React.Fragment>
    );
}
 
export default Leave;