import React, {useState, useEffect, useContext} from 'react';
import Pagination from '../../common/Pagination';
import Breadcrumb from '../../common/Breadcrumb'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import Paginate from '../../utils/Paginate';
import * as IoIcons from 'react-icons/io';
import * as GrIcons from 'react-icons/gr';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import { CSVLink} from "react-csv";
import { Button, Modal, Form, Badge } from 'react-bootstrap';
import { UserContext } from "../../Context";
import {toast} from 'react-toastify'

import { useNavigate } from 'react-router-dom';


const Employee = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [editRecord, setEditRecord] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState([]);    
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [showChild, setShowChild] = useState(false);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [name, setname] = useState('');
    const [contact, setcontact] = useState('');
    const [department, setdepartment] = useState('');
    const [status, setStatus] = useState('-');

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + '/employee/viewAllEmp', { params: { token: token } });
            if(response.data.status_code===200){
                console.log(response.data.message)
                setFiltered(response.data.message)
                setData(response.data.message)
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

    const handleModalClose = () => {setEditShow(false); setShowModalSelectedRow(false); setAddShow(false) ; setSelectedRecord([]) ; };


    const handleAddClose = () => setAddShow(false);
    const handleAddShow = () => setAddShow(true);

    const handleEditClose = () => setEditShow(false);
    const handleEditShow = (id) => {
        setEditShow(true); 
        let record = data.filter(item=> item.id === parseInt(id)); 
        setEditRecord(record[0]);
        navigate('/editProfile', {state:record});
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setAddShow(false);
    };


    useEffect(() => {  
        setFiltered(data)
    }, [])

    const handlePageChange= (page) => {
        setCurrentPage(page)
    }

    const showSelectedRow = (item) => {
        setShowModalSelectedRow(true)
        setSelectedRecord(item)
    }
    
    const filter = (e, column) =>{
        let res = e.target.value.toLowerCase()

        let filteredARR = [];

        setFiltered(data);
        filteredARR = data;

        if(currentPage>1){
            setCurrentPage(1)
        }

        if(column=='id' ){
            setId(res)            
            if(res!= ""){
                filteredARR = filteredARR.filter(emp => emp.id == res );
                console.log(filteredARR)
                setFiltered(filteredARR)
            }
            else{
                filteredARR = filteredARR;
                setFiltered(filteredARR)
            }
        }

        if(column=='name' ){
            setname(res)
            filteredARR = filteredARR.filter(emp => emp.firstName.toLowerCase().includes(res)  || 
                                            emp.lastName.toLowerCase().includes(res)   );
            setFiltered(filteredARR)
        }

        if(column=='contact' ){
            setcontact(res)
            filteredARR = filteredARR.filter(emp => emp.email.toLowerCase().includes(res) || emp.phoneNumber.toLowerCase().includes(res)     );
            setFiltered(filteredARR)
        }

        if(column=='department' ){
            setdepartment(res)
            filteredARR = filteredARR.filter(emp => emp.department_name.toLowerCase().includes(res) ||   emp.designation_name.toLowerCase().includes(res) || emp.userRole_name.toLowerCase().includes(res) );
            setFiltered(filteredARR)
        }

        if(column=='status' ){
            setStatus(res)
            filteredARR = filteredARR.filter(emp => emp.isActive==res  );
            setFiltered(filteredARR)
        }


        // ************************************Other columns Filter*********************

        if(id != "" && column!='id'){
            filteredARR = filteredARR.filter(emp => emp.id == id   );
            setFiltered(filteredARR)   
        }

        if(name != "" && column!='name'){
            filteredARR = filteredARR.filter(emp => emp.firstName.toLowerCase().includes(name)  || 
                                            emp.lastName.toLowerCase().includes(name)   );
            setFiltered(filteredARR)   
        }

        if(contact != "" && column!='contact'){
            console.log("cc contact")
            filteredARR = filteredARR.filter(emp => emp.email.toLowerCase().includes(contact) || emp.phoneNumber.toLowerCase().includes(contact)     );
            setFiltered(filteredARR)   
        }

        if(department != "" && column!='department'){
            filteredARR = filteredARR.filter(emp => emp.department_name.toLowerCase().includes(department) ||   emp.designation_name.toLowerCase().includes(department) || emp.userRole_name.toLowerCase().includes(department) );
            setFiltered(filteredARR)
        }

        if(status != "-" && column!='status'){
            filteredARR = filteredARR.filter(emp => emp.isActive==status );
            setFiltered(filteredARR)
        }
    }


    const resetFilter = (e) =>{
        setFiltered(data)
        setId('')
        setcontact('')
        setname('')
        setdepartment('')
        setStatus('-')
    }

    
    let Employees = Paginate(filtered, currentPage, pageSize)


    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Employee"/>
                </div>

                <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                    <div className='row mb-3'>
                        <div className='col'>
                            <h5 className="font-weight-bold pt-3">Employee</h5>
                        </div>
                        <div className='col justify-content-end '>
                            <IconContext.Provider value={{ size: '30' }}>
                            <Button  variant="primary" className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={()=> navigate('/addEmployee')}  ><IoIcons.IoMdAddCircleOutline />Add New Employee</Button >
                            <CSVLink data={data} filename="Employee"><Button  className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>                            
                            </IconContext.Provider> 
                                                        
                        </div>
                    </div>

                    <MDBTable >
                    <MDBTableHead color="info-color" textWhite>
                        <tr>
                        <th style={{width:"10%"}}>#</th>
                        <th style={{width:"15%"}}>photo</th>
                        <th style={{width:"20%"}}>Name</th>
                        <th style={{width:"10%"}}>Contact</th>
                        <th style={{width:"10%"}}>Department</th>
                        <th style={{width:"10%"}}>Manager</th>
                        <th style={{width:"15%"}}>Status</th>
                        <th style={{width:"10%"}}>Action</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        <tr style={{backgroundColor:"#33B5E5"}} >
                            <td ><input   onChange={(e)=>{filter(e,'id');}} value={id} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                            <td ></td>
                            <td><input   onChange={(e)=>{filter(e,'name');}} value={name} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                            <td><input   onChange={(e)=>{filter(e,'contact');}} value={contact} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                            <td><input   onChange={(e)=>{filter(e,'department');}} value={department} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                            <td></td>  
                            <td>
                                <Form.Select style={{height:"30px", fontSize:"12px"}} name="status" onChange={(e)=>{filter(e,'status');}} value={status} required>
                                    <option value="-" hidden default={true}>--</option>
                                    <option value="1">Active</option>
                                    <option value="0"> In Active</option>
                                </Form.Select>
                            </td>                              
                            <td >
                                <Button variant="secondary" onClick={resetFilter} className="mt-0 pt-1 pb-1" style={{fontSize:"12px"}}   size="sm">
                                RESET
                                </Button>
                            </td>
                        </tr>
                        {
                            Employees.map(item =>
                                <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><img src={item.image ? process.env.REACT_APP_APIURL + item.image : "/images/avatar.png"}  style={{ width: '50px', height: '50px' }}alt=""  className='rounded-circle'/></td>
                                <td>{item.firstName +' ' + item.lastName}</td>
                                <td>{item.phoneNumber} <br/>{item.email}</td>
                                <td>{item.department_name} <br/>{item.designation_name} <br/>{item.userRole_name}</td>
                                <td>{item.manager? item.manager_first_name :'-' } <br/>{item.manager?'ID : ' + item.manager :' '}</td>
                                <td>{item.isActive == true ? <Badge pill bg="success"> Active</Badge> : <Badge pill bg="danger"> Inactive</Badge>} </td>
                                <td>
                                    <IconContext.Provider value={{ size: '20', color:"green" }}>
                                        <AiIcons.AiFillEdit onClick={() =>handleEditShow(item.id)} />
                                        <GrIcons.GrView className='ml-3' onClick={() => showSelectedRow(item)} />
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

            <Modal show={showModalSelectedRow} onHide={handleModalClose} centered size="xl">
                <Modal.Header closeButton>
                <Modal.Title >{selectedRecord.firstName +' ' + selectedRecord.lastName}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                    <   div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                            <div className='col font-weight-bold'>User Role</div>
                            <div className='col'> : {selectedRecord.userRole_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>First Name</div>
                            <div className='col'> : {selectedRecord.firstName}</div>
                            <div className='col font-weight-bold'>Last Name</div>
                            <div className='col'> : {selectedRecord.lastName}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Department</div>
                            <div className='col'> : {selectedRecord.department_name}</div>
                            <div className='col font-weight-bold'>Designation</div>
                            <div className='col'> : {selectedRecord.designation_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Email</div>
                            <div className='col'> : {selectedRecord.email}</div>
                            <div className='col font-weight-bold'>Contact Number</div>
                            <div className='col'> : {selectedRecord.phoneNumber}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Religion</div>
                            <div className='col'> : {selectedRecord.religion}</div>
                            <div className='col font-weight-bold'>Maritual Status</div>
                            <div className='col'> : {selectedRecord.maritualStatus}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>DOB</div>
                            <div className='col'> : {selectedRecord.dob}</div>
                            <div className='col font-weight-bold'>Address</div>
                            <div className='col'> : {selectedRecord.address}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>isShow</div>
                            <div className='col'> : {selectedRecord.isActive  === true? <Badge pill bg="success"> Active</Badge> : <Badge pill bg="danger"> Inactive</Badge>}</div>
                            <div className='col font-weight-bold'>Manager</div>
                            <div className='col'> : {selectedRecord.manager? selectedRecord.manager:'-' }</div>
                        </div><br />
                        
                        <div className='row'>
                            <div className='col font-weight-bold'>Created By</div>
                            <div className='col'> : {selectedRecord.createdBy}</div>
                            <div className='col font-weight-bold'>Created Date</div>
                            <div className='col'> : {selectedRecord.createdDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Modified By</div>
                            <div className='col'> : {selectedRecord.modifiedBy}</div>
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

        </React.Fragment>
    );
}
 
export default Employee;