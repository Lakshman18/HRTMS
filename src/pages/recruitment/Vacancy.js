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
import { Button, Modal, Form, Badge } from 'react-bootstrap';
import { UserContext } from "../../Context";
import { toast} from 'react-toastify'

const Vacancy = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [designationData, setDesignationData] = useState([]);
    const [departmentDesignationData, setDepartmentDesignationData] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + '/vacancy', { params: { token: token } });
            const dep_response = await axios.get(process.env.REACT_APP_APIURL + '/department', { params: { token: token } });
            const desig_response = await axios.get(process.env.REACT_APP_APIURL + '/designation', { params: { token: token } });

            if(response.data.status_code===200  && dep_response.data.status_code===200  && desig_response.data.status_code===200){
                console.log(response.data.message)
                setFiltered(response.data.message)
                setData(response.data.message)
                setDepartmentData(dep_response.data.message.filter(item => item.isActive==true))
                setDesignationData(desig_response.data.message.filter(item => item.isActive==true))
            }
            else{
                setFiltered([])
                setData([])
                setDepartmentData([])
                setDesignationData([])
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

    const handleModalClose = () => {setEditShow(false); setShowModalSelectedRow(false); setAddShow(false) ;setDeleteShow(false); setSelectedRecord([]) ; };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    department : e.target.department.value,
                    designation : e.target.designation.value,
                    no_of_vacancy : e.target.no_of_vacancy.value,
                    closingDate :e.target.closingDate.value,
                    createdBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/vacancy/', requestOptions)
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
            toast.error("Failed to add new vacancy");
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
                    department : e.target.department.value,
                    designation : e.target.designation.value,
                    no_of_vacancy : e.target.no_of_vacancy.value,
                    closingDate :e.target.closingDate.value,
                    modifiedBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/vacancy/', requestOptions)
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
            toast.error("Failed to edit vacancy");
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
            let response = await fetch(process.env.REACT_APP_APIURL + '/vacancy', requestOptions)
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
            toast.error("Failed to delete vacancy");
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

        if(column=='department' ){
            setDepartment(res)
            filteredARR = filteredARR.filter(vacancy => vacancy.department_name.toLowerCase().includes(res)  );
            setFiltered(filteredARR)
        }

        if(column=='designation' ){
            setDesignation(res)
            filteredARR = filteredARR.filter(vacancy => vacancy.designation_name.toLowerCase().includes(res) );
            setFiltered(filteredARR)
        }

        // ************************************Other columns Filter*********************

        if(department != "" && column!='department'){
            filteredARR = filteredARR.filter(vacancy => vacancy.department_name.toLowerCase().includes(department));
            setFiltered(filteredARR)
        }

        if(designation != "" && column!='designation'){
            filteredARR = filteredARR.filter(vacancy => vacancy.designation_name.toLowerCase().includes(designation));
            setFiltered(filteredARR)
        }

        
    }

    const resetFilter = (e) =>{
        setFiltered(data)
        setDesignation('')
        setDepartment('')
    }

    const showSelectedRow = (item) => {
        setShowModalSelectedRow(true)
        setSelectedRecord(item)
    }
     
    let vacancys = Paginate(filtered, currentPage, pageSize)


    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Vacancy"/>
                </div>
                
                    <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <h6 className="font-weight-bold pt-3">Vacancy</h6>
                            </div>
                            <div className='col justify-content-end '>
                                <IconContext.Provider value={{ size: '30' }}>
                                <Button type="button " className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Add New Vacancy</Button>
                                <CSVLink data={filtered} filename="vacancy"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                                </IconContext.Provider>     
                            </div>
                        </div>
                    
                    
                        <MDBTable >
                        <MDBTableHead color="info-color" textWhite>
                            <tr>
                            <th style={{width:"5%"}}>#</th>
                            <th style={{width:"20%"}}>Depeartment</th>
                            <th style={{width:"20%"}}>Designation</th>
                            <th style={{width:"15%"}}>No Of Vacancies</th>
                            <th style={{width:"25%"}}>Closing Date</th>
                            <th style={{width:"15%"}}>Action</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            <tr style={{backgroundColor:"#33B5E5"}} >
                                <td ></td>
                                <td><input onChange={(e)=>{filter(e,'department');}} value={department} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input onChange={(e)=>{filter(e,'designation');}} value={designation} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td> </td>
                                <td></td>                               
                                <td >
                                    <Button variant="secondary" onClick={resetFilter} className="mt-0 pt-1 pb-1" style={{fontSize:"12px"}}   size="sm">
                                    RESET
                                    </Button>
                                </td>
                            </tr>
                            {
                                vacancys.map(item =>
                                    <tr key={item.id} >
                                        <td>{item.id}</td>
                                        <td>{item.department_name}</td>
                                        <td>{item.designation_name}</td>
                                        <td>{item.no_of_vacancy}</td>
                                        <td>{item.closingDate}</td>
                                        <td>
                                            <IconContext.Provider value={{ size: '20', color:"green" }}>
                                                <AiIcons.AiFillEdit onClick={() => handleEditShow(item.id)} />
                                                <GrIcons.GrView className='ml-3' onClick={() => showSelectedRow(item)} />
                                            </IconContext.Provider> 

                                            <IconContext.Provider value={{ size: '20', color:"red" }}>
                                                <AiIcons.AiFillDelete className="ml-3" onClick={() => handleDeleteShow(item)} />
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
                <Modal.Title>Add New Vacancy</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleAddSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label >Department Name</Form.Label >
                                <Form.Select name="department" onChange={(des)=>{setDepartmentDesignationData(designationData.filter(designation => designation.department== parseInt(des.target.value)))}} required>
                                <option value="-" hidden default={true}>--</option>
                                    {departmentData.map(item=><option key={item.id} value={item.id}>{item.departmentName}</option>)}
                                </Form.Select>

                                <Form.Label >Designation</Form.Label >
                                <Form.Select name="designation" required>
                                    <option value="-" hidden default={true}>--</option>
                                    {departmentDesignationData.map(item=><option key={item.id} value={item.id}>{item.designationName}</option>)}
                                </Form.Select>  

                                <Form.Label>No of Vacancy</Form.Label>
                                <Form.Control type="number" placeholder="Enter No of Vacancy" name="no_of_vacancy" required/>   

                                <Form.Label>Closing Date</Form.Label>
                                <Form.Control type="date" placeholder="Enter Closing Date" name="closingDate" required/> 

                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer  className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit" size="md" >
                            save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>

            <Modal show={editShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Edit vacancy</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label >Department Name</Form.Label >
                                <Form.Control disabled type="text" placeholder="Enter Department Name" name="departmentName" defaultValue={selectedRecord.department_name}/>  
                                
                                <Form.Label >Designation</Form.Label >
                                <Form.Control disabled type="text" placeholder="Enter Designation Name" name="designationName" defaultValue={selectedRecord.designation_name}/>  
                            
                                <Form.Label>No of Vacancy</Form.Label>
                                <Form.Control type="number" placeholder="Enter NUmber of vacancy" name="no_of_vacancy" defaultValue={selectedRecord.no_of_vacancy}/>  
                                
                                <Form.Label>Closing Date</Form.Label>
                                <Form.Control type="date" placeholder="Enter Closing Date" name="closingDate" defaultValue={selectedRecord.closingDate} required/> 
                                                                         
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer  className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit"  size="md">
                            save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>   

            <Modal show={showModalSelectedRow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title >{selectedRecord.department_name} {selectedRecord.designation_name}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                    <   div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Department</div>
                            <div className='col'> : {selectedRecord.department_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Designation</div>
                            <div className='col'> : {selectedRecord.designation_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>No of Vacancy</div>
                            <div className='col'> : {selectedRecord.no_of_vacancy}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Closing Date</div>
                            <div className='col'> : {selectedRecord.closingDate}</div>
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

            <Modal show={deleteShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title >{selectedRecord.department_name +' ' + selectedRecord.designation_name}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                        <div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Department Name</div>
                            <div className='col'> : {selectedRecord.department_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Designation Name</div>
                            <div className='col'> : {selectedRecord.designation_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>No of Vacancy</div>
                            <div className='col'> : {selectedRecord.no_of_vacancy}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Closing Date</div>
                            <div className='col'> : {selectedRecord.closingDate}</div>
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
 
export default Vacancy;