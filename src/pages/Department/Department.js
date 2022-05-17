import React, {useState, useEffect, useContext} from 'react';
import Pagination from '../../common/Pagination';
import Breadcrumb from '../../common/Breadcrumb'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import Paginate from '../../utils/Paginate';
import * as IoIcons from 'react-icons/io';
import * as GrIcons from 'react-icons/gr';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import { CSVLink } from "react-csv";
import { Button, Modal, Form, Badge} from 'react-bootstrap';
import { UserContext } from "../../Context";
import {ToastContainer, toast} from 'react-toastify'

const Department = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState([]);    
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [depName, setDepName] = useState('');
    const [status, setStatus] = useState('-');

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + '/department', { params: { token: token } });
            if(response.data.status_code===200){
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

    const handleAddShow = () => setAddShow(true);

    const handleEditShow = (id) => {
        setEditShow(true); 
        let record = data.filter(item=> item.id === parseInt(id)); 
        setSelectedRecord(record[0]);
    };

    const handleModalClose = () => {setEditShow(false); setShowModalSelectedRow(false); setAddShow(false) ; setSelectedRecord([]); }
    
    const handleAddSubmit = async(e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    departmentName : e.target.departmentName.value,
                    isActive : e.target.isActive.value,
                    createdBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/department', requestOptions)
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
            toast.error("Failed to add new department");
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
                    departmentName : e.target.departmentName.value,
                    isActive : e.target.isActive.value,
                    modifiedBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/department', requestOptions)
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
            toast.error("Failed to edit department");
        }
        setEditShow(false); 
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

        if(column=='depName' ){
            setDepName(res)
            filteredARR = filteredARR.filter(department => department.departmentName.toLowerCase().includes(res)  );
            setFiltered(filteredARR)
        }

        if(column=='status' ){
            setStatus(res)
            filteredARR = filteredARR.filter(department => department.isActive==res  );
            setFiltered(filteredARR)
        }

        // ************************************Other columns Filter*********************

        if(depName != "" && column!='depName'){
            filteredARR = filteredARR.filter(department => department.departmentName.toLowerCase().includes(depName));
            setFiltered(filteredARR)   
        }

        if(status != "-" && column!='status'){
            filteredARR = filteredARR.filter(department => department.isActive==status);
            setFiltered(filteredARR)
        }
    }

    const resetFilter = (e) =>{
        setFiltered(data)
        setDepName('')
        setStatus('-')
    }
    
    let Departments = Paginate(filtered, currentPage, pageSize)

    const showSelectedRow = (item) => {
        setShowModalSelectedRow(true)
        setSelectedRecord(item)
    }

    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Department"/>
                </div>

                
                    <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <h5 className="font-weight-bold pt-3">Department</h5>
                            </div>
                            <div className='col justify-content-end '>
                                <IconContext.Provider value={{ size: '30' }}>
                                <Button  variant="primary" className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Add New Department</Button >
                                <CSVLink data={filtered} filename="Department"><Button  className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>                            
                                </IconContext.Provider>  
                    
                            </div>
                        </div>

                        <MDBTable >
                        <MDBTableHead color="info-color" textWhite>
                            <tr>
                                <th style={{width:"10%"}}>#</th>
                                <th style={{width:"30%"}}>Department Name</th>
                                <th style={{width:"30%"}}>Status</th>
                                <th style={{width:"30%"}}>Action</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                                <tr style={{backgroundColor:"#33B5E5"}} >
                                    <td > </td>
                                    <td><input onChange={(e)=>{filter(e,'depName');}} value={depName} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
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
                                Departments.map(item =>
                                    <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.departmentName}</td>
                                    <td>
                                        {item.isActive === true? <Badge pill bg="success"> Active</Badge> : <Badge pill bg="danger"> Inactive</Badge>} 
                                    </td>
                                    <td>
                                        <IconContext.Provider value={{ size: '20', color:"green" }}>
                                            <AiIcons.AiFillEdit onClick={() => handleEditShow(item.id)} />                                 
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

            <Modal show={addShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Add New Department</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleAddSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label>Department Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter department name" name="departmentName" required/>                                           
                                
                                <Form.Label >Status</Form.Label >
                                <Form.Select name="isActive" required>
                                    <option value="-" hidden default={true}>--</option>
                                    <option value="1">Active</option>
                                    <option value="0">InActive</option>
                                </Form.Select>    
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit" size="md"  >
                            save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>

            <Modal show={editShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Edit Department</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label>Department Name</Form.Label>
                                <Form.Control type="text" name="departmentName" defaultValue={selectedRecord.departmentName} />                                           

                                <Form.Label >Status</Form.Label >
                                <Form.Select name="isActive" defaultValue={selectedRecord.isActive} >
                                    <option value="true">Active</option>
                                    <option value="false"> InActive</option>
                                </Form.Select>
                            
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit" size="md">
                            save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal> 

            <Modal show={showModalSelectedRow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title >{selectedRecord.designation}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                        <div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Department Name</div>
                            <div className='col'> : {selectedRecord.departmentName}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Status</div>
                            <div className='col'> : {selectedRecord.isActive  === true? <Badge pill bg="success"> Active</Badge> : <Badge pill bg="danger"> Inactive</Badge>}</div>
                        </div><br />
                        
                        <div className='row'>
                            <div className='col font-weight-bold'>Created By</div>
                            <div className='col'> : {selectedRecord.createdBy}</div>
                        </div>
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
        </React.Fragment>
    );
}
 
export default Department;