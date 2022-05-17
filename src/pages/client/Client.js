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
import {passwordValidation, comparePassword, NICvalidation} from '../../utils/Validation';

const Client = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);    
    const [password1, setPassword1] = useState("");
    const [passwordErr, setPasswordErr] = useState("Error");
    const [passwordMatchErr, setPasswordMatchErr] = useState("Error");
    const [selectedRecord, setSelectedRecord] = useState([]);    
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + "/client", { params: { token: token } });
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

    const handleModalClose = () => {setEditShow(false); setShowModalSelectedRow(false); setAddShow(false) ; setSelectedRecord([]) ; };
    
    const handleAddSubmit = async(e) => {
        e.preventDefault();
        try{
            if(e.target.password1.value === e.target.password2.value){                
                const requestOptions = {
                    method: 'POST',
                    headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        token: token ,
                        name : e.target.name.value,
                        email : e.target.email.value,
                        client_password : e.target.password1.value,
                        phone : e.target.phone.value,
                        dateJoined : e.target.dateJoined.value,
                        taxNo : e.target.taxNo.value,
                        address : e.target.address.value,
                        isActive : e.target.isActive.value,
                        createdBy : user,
                    })
                };
                let response = await fetch(process.env.REACT_APP_APIURL + '/client/', requestOptions)
                response = await response.json();  
          
                if(response.status_code===200){
                    getData()
                    toast.success(response.message);
                }
                else{
                    toast.error(response.message);
                } 
                setAddShow(false);   
            }
            else{
                toast.error("Passwords do not match");
            }            
        }    
        catch(error){      
            console.log(error)
            toast.error("Failed to add new client");
        }
        
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
                    email : e.target.email.value,
                    phone : e.target.phone.value,
                    taxNo : e.target.taxNo.value,
                    address : e.target.address.value,
                    isActive : e.target.isActive.value,
                    modifiedBy : user,
                })                
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/client/', requestOptions)
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
            toast.error("Failed to edit role");
        }
        setEditShow(false); 
    };

    const handlePageChange= (page) => {
        setCurrentPage(page)
    }

    const passwordCheck = (pass) => {
        setPasswordErr(passwordValidation(pass));
    }

    const compareBothPasswords = (pass) => {
        setPasswordMatchErr(comparePassword(password1,pass));
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
            filteredARR = filteredARR.filter(client => client.name.toLowerCase().includes(res)  );
            setFiltered(filteredARR)
        }

        if(column=='email' ){
            setEmail(res)
            filteredARR = filteredARR.filter(client => client.email.toLowerCase().includes(res)  );
            setFiltered(filteredARR)
        }

        if(column=='status' ){
            setStatus(res)
            filteredARR = filteredARR.filter(client => client.isActive==res  );
            setFiltered(filteredARR)
        }

        // ************************************Other columns Filter*********************

        if(name != "" && column!='name'){
            filteredARR = filteredARR.filter(client => client.name.toLowerCase().includes(name));
            setFiltered(filteredARR)   
        }

        if(name != "" && column!='email'){
            filteredARR = filteredARR.filter(client => client.email.toLowerCase().includes(email));
            setFiltered(filteredARR)   
        }

        if(status != "-" && column!='status'){
            filteredARR = filteredARR.filter(client => client.isActive==status);
            setFiltered(filteredARR)
        }
    }

    const resetFilter = (e) =>{
        setFiltered(data)
        setName('')
        setEmail('')
        setStatus('-')
    }
    
    let clients = Paginate(filtered, currentPage, pageSize)

    const showSelectedRow = (item) => {
        setShowModalSelectedRow(true)
        setSelectedRecord(item)
    }

    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Clients"/>
                </div>

                {data.length>0
                ?
                    <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <h6 className="font-weight-bold pt-3">Clients</h6>
                            </div>
                            <div className='col justify-content-end '>
                                <IconContext.Provider value={{ size: '30' }}>
                                <Button type="button " className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Add New Client</Button>
                                <CSVLink data={filtered} filename="Client"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                                </IconContext.Provider>                                                                                    
                            </div>
                        </div>

                        <MDBTable >
                        <MDBTableHead color="info-color" textWhite>
                            <tr>
                            <th style={{width:"10%"}}>#</th>
                            <th style={{width:"20%"}}>Name</th>
                            <th style={{width:"10%"}}>Email</th>
                            <th style={{width:"15%"}}>Date Joined</th>
                            <th style={{width:"15%"}}>Phone</th>
                            <th style={{width:"15%"}}>Status</th>
                            <th style={{width:"15%"}}>Action</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            <tr style={{backgroundColor:"#33B5E5"}} >
                                <td ></td>
                                <td><input   onChange={(e)=>{filter(e,'name');}} value={name} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input   onChange={(e)=>{filter(e,'email');}} value={email} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td> </td>
                                <td> </td>
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
                                clients.map(item =>
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.dateJoined}</td>
                                        <td>{item.phone}</td>
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
                :
                    <div></div>
                } 

            </div>

            <Modal show={addShow} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Client</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleAddSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >                               

                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label>Client Name</Form.Label>
                                        <Form.Control type="text" name="name" /> 
                                    </div>
                                    <div className='col'>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="text" name="email" />       
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" name="phone"  />  
                                    </div>
                                    <div className='col'>
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" name="address"  />   
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label>Tax Number</Form.Label>
                                        <Form.Control type="text" name="taxNo" />  
                                    </div>
                                    <div className='col'>
                                    <Form.Label >Status</Form.Label >
                                    <Form.Select name="isActive" required>
                                        <option value="-" hidden default={true}>--</option>
                                        <option value="1">Active</option>
                                        <option value="0">InActive</option>
                                    </Form.Select>  
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label>Date Joined</Form.Label>
                                        <Form.Control type="date" name="dateJoined" />  
                                    </div>
                                    <div className='col'>
                                        <Form.Label>User Role</Form.Label>
                                        <Form.Control type="text" name="userRole" value="Client" disabled />  
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <Form.Label>password</Form.Label>
                                        <Form.Control type="password" name="password1"  onChange={e=> {setPassword1(e.target.value); passwordCheck(e.target.value)}}  required/> 
                                    </div>
                                    <div className='col'>
                                        <Form.Label>password</Form.Label>
                                        <Form.Control type="password" name="password2"  onChange={e=> compareBothPasswords(e.target.value)}
                                            disabled={passwordErr != "" ? true : false } required/>                          
                                    </div>                                    
                                </div>

                                <div className="alert alert-danger" role="alert" hidden={passwordErr == "" || passwordErr == "Error"  ? true : false }>
                                    {passwordErr}
                                </div>

                                <div className="alert alert-danger" role="alert" hidden={passwordMatchErr == "" || passwordMatchErr == "Error"  ? true : false }>
                                    {passwordMatchErr}
                                </div>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit"  size="md" disabled={passwordErr != "" || passwordMatchErr != ""   ? true : false}>
                            Save 
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>

            <Modal show={editShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Edit Client</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                        <Form.Group className="mb-3" >   
                            <div className='row'>
                                <div className='col'>
                                    <Form.Label>Client Name</Form.Label>
                                    <Form.Control type="text" name="name" defaultValue={selectedRecord.name} disabled/> 
                                </div>
                                <div className='col'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" name="email" defaultValue={selectedRecord.email} disabled />       
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col'>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="text" name="phone" defaultValue={selectedRecord.phone} />  
                                </div>
                                <div className='col'>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" name="address" defaultValue={selectedRecord.address} />   
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col'>
                                    <Form.Label>Tax Number</Form.Label>
                                    <Form.Control type="text" name="taxNo" defaultValue={selectedRecord.taxNo} />  
                                </div>
                                <div className='col'>
                                <Form.Label >Status</Form.Label >
                                <Form.Select name="isActive" defaultValue={selectedRecord.isActive}>
                                    <option value="true">Active</option>
                                    <option value="false">InActive</option>
                                </Form.Select>  
                                </div>
                            </div>

                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className=' d-flex justify-content-center'>
                        <Button variant="secondary" onClick={handleModalClose} size="md">
                            Close
                        </Button>
                        <Button variant="primary" type="submit" size="md">
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal> 

            <Modal show={showModalSelectedRow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title >{selectedRecord.name}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                        <div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Client Name</div>
                            <div className='col'> : {selectedRecord.name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Email</div>
                            <div className='col'> : {selectedRecord.email}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Phone Number</div>
                            <div className='col'> : {selectedRecord.phone}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Address</div>
                            <div className='col'> : {selectedRecord.address}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Date Joined</div>
                            <div className='col'> : {selectedRecord.dateJoined}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Tax Number</div>
                            <div className='col'> : {selectedRecord.taxNo}</div>
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
 
export default Client;