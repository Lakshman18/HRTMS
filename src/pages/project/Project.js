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
import {ToastContainer, toast} from 'react-toastify'
import Select from 'react-select'

import { MultiSelect } from "react-multi-select-component";

const Project = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);    
    const [clientData, setClientData] = useState([]);
    const [selectedEmployeeData, setSelectedEmployeeData] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);  
    const [selectedRecord, setSelectedRecord] = useState([]);    
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [project, setProject] = useState('');
    const [client, setClient] = useState('');
    const [employee, setEmployee] = useState('');
    const [status, setStatus] = useState('-');

    const [selectededitOptions, setSelectededitOptions] = useState([]);

    let editOptions = [];

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + '/project', { params: { token: token } });
            const client_response = await axios.get(process.env.REACT_APP_APIURL + '/client/', { params: { token: token } });
            const employee_response = await axios.get(process.env.REACT_APP_APIURL + '/employee/viewAllEmp', { params: { token: token } });
            
            if(client_response.data.status_code===200 && employee_response.data.status_code===200  ){
                setFiltered(response.data.message)
                setData(response.data.message)
                setClientData(client_response.data.message.filter(item => item.isActive==true))
                setEmployeeData(employee_response.data.message.filter(item => item.isActive==true))
                console.log(response.data.message)
            }
            else{
                setFiltered([])
                setData([])
                setClientData([])
                setEmployeeData([])
                toast.error(response.data.message);
            }
        } 
        catch(error){      
            console.log(error)
            toast.error("Failed to fetch");
        }            
    }

    const handleAddShow = () => setAddShow(true);

    const handleEditShow = (id) => {
        
        let record = data.filter(item=> item.id === parseInt(id)); 
        setSelectedRecord(record[0]);

        record[0].employee.map(item => { 
            editOptions.push({
                value:   item.id,
                label: item.firstName +' ' + item.lastName
            });
        })
        setSelectededitOptions(editOptions)
        setEditShow(true); 
    };

    const handleModalClose = () => {setEditShow(false); setShowModalSelectedRow(false); setAddShow(false) ; setSelectedRecord([]); setSelectedEmployeeData([]); }

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        let empList = []
        selectedEmployeeData.map(item=> empList.push(item.value))
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    client : e.target.clientName.value,
                    projectName : e.target.projectName.value,
                    employee : empList,
                    isActive :e.target.isActive.value,
                    startDate : e.target.startDate.value,
                    renewalDate :e.target.renewalDate.value,
                    createdBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/project', requestOptions)
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
        let empList = []
        selectededitOptions.map(item=> empList.push(item.value))
        try{
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    id:selectedRecord.id,
                    client : selectedRecord.client,
                    projectName : e.target.projectName.value,
                    employee : empList,
                    isActive :e.target.isActive.value,
                    startDate : e.target.startDate.value,
                    renewalDate :e.target.renewalDate.value,
                    modifiedBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/project', requestOptions)
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

        if(column=='project' ){
            setProject(res)
            filteredARR = filteredARR.filter(project => project.projectName.toLowerCase().includes(res));
            setFiltered(filteredARR)
        }

        if(column=='client' ){
            setClient(res)            
            filteredARR = filteredARR.filter(project => project.client_name.toLowerCase().includes(res) );
            setFiltered(filteredARR)
            console.log(filteredARR)
        }

        if(column=='employee' ){
            setEmployee(res)
            filteredARR = filteredARR.filter(project => project.employee.some(emp => emp.firstName.toLowerCase().includes(res))    );
            setFiltered(filteredARR)
        }

        if(column=='status' ){
            setStatus(res)
            filteredARR = filteredARR.filter(project  => project.isActive==res );
            setFiltered(filteredARR)
        }

        // ************************************Other columns Filter*********************

        if(project != "" && column!='project'){
            filteredARR = filteredARR.filter(project1 => project1.projectName.toLowerCase().includes(project) );
            setFiltered(filteredARR)   
        }

        if(client != "" && column!='client'){
            filteredARR = filteredARR.filter(project => project.client_name.toLowerCase().includes(client)  );
            setFiltered(filteredARR)   
        }

        if(employee != "" && column!='employee'){
            filteredARR = filteredARR.filter(project => project.employee.some(emp => emp.firstName.toLowerCase().includes(employee))    );
            setFiltered(filteredARR)   
        }

        if(status != "-" && column!='status'){
            filteredARR = filteredARR.filter(project =>  project.isActive==status    );
            setFiltered(filteredARR)
        }
    }

    const resetFilter = (e) =>{
        setFiltered(data)
        setProject('')
        setClient('')
        setEmployee('')
        setStatus('-')
    }
    
    let projects = Paginate(filtered, currentPage, pageSize)

    const showSelectedRow = (item) => {
        console.log(item)
        setShowModalSelectedRow(true)
        setSelectedRecord(item)
        setSelectedEmployeeData(item.employee)
    }

    let options = []

    employeeData.map(item => { 
        options.push({
            value:   item.id,
            label: item.firstName +' ' + item.lastName
        });
    })


    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Project"/>
                </div>

                {data.length>0
                ?
                    <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <h6 className="font-weight-bold pt-3">Projects</h6>
                            </div>
                            <div className='col justify-content-end '>
                                <IconContext.Provider value={{ size: '30' }}>
                                <Button type="button " className="btn-sm btn-info float-right mt-3 ml-3 mb-1"  onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Add New Project</Button>
                                <CSVLink data={filtered} filename="Project"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                                </IconContext.Provider>      
                            </div>
                        </div>

                        <MDBTable >
                        <MDBTableHead color="info-color" textWhite>
                            <tr>
                            <th style={{width:"5%"}}>#</th>
                            <th style={{width:"15%"}}>Project Name</th>
                            <th style={{width:"15%"}}>Client Name</th>
                            <th style={{width:"15%"}}>employee</th>
                            <th style={{width:"12%"}}>Start Date</th>
                            <th style={{width:"13%"}}>Renewal Date</th>
                            <th style={{width:"15%"}}>Status</th>
                            <th style={{width:"10%"}}>Action</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            <tr style={{backgroundColor:"#33B5E5"}} >
                                <td ></td>
                                <td><input   onChange={(e)=>{filter(e,'project');}} value={project} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input   onChange={(e)=>{filter(e,'client');}} value={client} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input   onChange={(e)=>{filter(e,'employee');}} value={employee} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td></td>
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
                                projects.map(item =>
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.projectName}</td>
                                        <td>{item.client_name}</td>
                                        <td>{item.employee.map(item => <div className="row" key={item.id}>{item.firstName}</div> )}</td>
                                        <td>{item.startDate}</td>
                                        <td>{item.renewalDate}</td>
                                        <td>
                                        {item.isActive === true ? <Badge pill bg="success"> Active</Badge> : <Badge pill bg="danger"> Inactive</Badge>} 
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
                :
                    <div></div>
                } 

            </div>

            <Modal show={addShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Add New Project</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleAddSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label >Client Name</Form.Label>
                                        <Form.Select name="clientName" required>
                                            {clientData.map(item=> <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </Form.Select>
                                    </div>
                                    <div className='col'>
                                        <Form.Label>Project Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter project name" name="projectName" required/>                                          
                                    </div>
                                </div>

                                <div className='row'>                                    
                                    <div className='col'>
                                    <Form.Label >Status</Form.Label >
                                    <Form.Select name="isActive" required>
                                        <option value="-" hidden default={true}>--</option>
                                        <option value="true">Active</option>
                                        <option value="false">InActive</option>
                                    </Form.Select>                                            
                                    </div>
                                    <div className='col' style={{width:"50%"}}>
                                    <Form.Label >Employee</Form.Label>
                                    <MultiSelect
                                        options={options}
                                        value={selectedEmployeeData}
                                        onChange={setSelectedEmployeeData}
                                        labelledBy="Select"
                                        required
                                    />
                                    </div>
                                </div> <br />

                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label>Start date</Form.Label>
                                        <Form.Control type="date" placeholder="Enter start date" name="startDate" required/>    
                                    </div>
                                    <div className='col'>
                                        <Form.Label>Renewal date</Form.Label>
                                        <Form.Control type="date" placeholder="Enter renewal date" name="renewalDate" required/>                                           
                                    </div>
                                </div>

                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose}  size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit"  size="md" >
                            save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>

            <Modal show={editShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Edit Project</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                        <Form.Group className="mb-3" >
                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label>Client Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter project name" name="clientName" defaultValue={selectedRecord.client_name} disabled/>                                          
                                    </div>
                                    <div className='col'>
                                        <Form.Label>Project Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter project name" name="projectName" defaultValue={selectedRecord.projectName}/>                                          
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'  style={{width:"50%"}}>
                                    <Form.Label >Employee</Form.Label>
                                    <MultiSelect
                                        options={options}
                                        value={selectededitOptions}
                                        onChange={setSelectededitOptions}
                                        labelledBy="Select"                                        
                                    />

                                    </div>
                                    <div className='col'>
                                    <Form.Label >Status</Form.Label >
                                    <Form.Select name="isActive" defaultValue={selectedRecord.isActive}>
                                        <option value="true">Active</option>
                                        <option value="false">InActive</option>
                                    </Form.Select>                                                                                        
                                    </div>
                                </div> <br />

                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label>Start date</Form.Label>
                                        <Form.Control type="date" placeholder="Enter start date" name="startDate" defaultValue={selectedRecord.startDate}/>    
                                    </div>
                                    <div className='col'>
                                        <Form.Label>Renewal date</Form.Label>
                                        <Form.Control type="date" placeholder="Enter renewal date" name="renewalDate" defaultValue={selectedRecord.renewalDate}/>                                           
                                    </div>
                                </div>

                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className=' d-flex justify-content-center'>
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
                <Modal.Title >{selectedRecord.projectName}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                        <div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Client Name</div>
                            <div className='col'> : {selectedRecord.client_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Project Name</div>
                            <div className='col'> : {selectedRecord.projectName}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Employee</div>
                            <div className='col'>{selectedEmployeeData.map(item=> <div className="" key={item.id}>: {item.firstName}</div>)}</div>
                                    
                            {/* : {selectedRecord.employee.map(item => <div className='row'>{item}</div>)} */}
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Start Date</div>
                            <div className='col'> : {selectedRecord.startDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Renewal Date</div>
                            <div className='col'> : {selectedRecord.renewalDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Status</div>
                            <div className='col'> : {selectedRecord.status  === '1'? <Badge pill bg="success"> Active</Badge> : <Badge pill bg="danger"> Inactive</Badge>}</div>
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
 
export default Project;