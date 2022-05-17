import React, {useState, useEffect, useContext} from 'react';
import Pagination from '../../common/Pagination';
import Breadcrumb from '../../common/Breadcrumb'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import Paginate from '../../utils/Paginate';
import * as GrIcons from 'react-icons/gr';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import { CSVLink } from "react-csv";
import { Button, Modal, Form, Badge } from 'react-bootstrap';
import { UserContext } from "../../Context";
import { toast} from 'react-toastify'

const Applicant = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [editShow, setEditShow] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [name, setName] = useState('');
    const [vacancy, setVacancy] = useState('');
    const [contact, setContact] = useState('');
    const [status, setStatus] = useState('-');

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + '/vacancy/application', { params: { token: token } });
            
            if(response.data.status_code===200   ){
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
    
    const handleEditShow = (id) => {
        setEditShow(true); 
        let record = data.filter(item=> item.id === parseInt(id)); 
        setSelectedRecord(record[0]);
    };

    const handleModalClose = () => {setEditShow(false); setShowModalSelectedRow(false);  setSelectedRecord([]) ; };

    const handleEditSubmit = async(e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    id:selectedRecord.id,
                    applicant_status :e.target.status.value,
                    modifiedBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/vacancy/application', requestOptions)
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
            toast.error("Failed to edit application");
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

        if(column=='vacancy' ){
            setVacancy(res)

            if(res!= ""){
                filteredARR = filteredARR.filter(application => application.vacancy == res  );
                setFiltered(filteredARR)
            }
            else{
                filteredARR = filteredARR;
                setFiltered(filteredARR)
            }
        }

        if(column=='name' ){
            setName(res)
            filteredARR = filteredARR.filter(application => application.applicant_name.toLowerCase().includes(res)  );
            setFiltered(filteredARR)
        }

        if(column=='contact' ){
            setContact(res)
            filteredARR = filteredARR.filter(application => application.applicant_email.toLowerCase().includes(res) || application.applicant_phone.toLowerCase().includes(res));
            setFiltered(filteredARR)
        }

        if(column=='status'){
            setStatus(res)
            filteredARR = filteredARR.filter( application =>  application.applicant_status.toLowerCase().includes(res)) ;
            setFiltered(filteredARR)
        }  

        // ************************************Other columns Filter*********************

        if(vacancy != "" && column!='vacancy'){
            filteredARR = filteredARR.filter(application => application.vacancy == vacancy);
            setFiltered(filteredARR)
        }

        if(name != "" && column!='name'){
            filteredARR = filteredARR.filter(application => application.applicant_name.toLowerCase().includes(name));
            setFiltered(filteredARR)
        }

        if(contact != "" && column!='contact'   ){
            filteredARR = filteredARR.filter(application => application.applicant_email.toLowerCase().includes(contact) || application.applicant_phone.toLowerCase().includes(contact));
            setFiltered(filteredARR)
        }

        if(status != "-" && column!='status'){
            filteredARR = filteredARR.filter( application =>  application.applicant_status.toLowerCase().includes(status)) ;
            setFiltered(filteredARR)
        }        
    }

    
    const resetFilter = (e) =>{
        setFiltered(data)
        setVacancy('')
        setName('')
        setContact('')
        setStatus('-')
    }

    const downloadFile = (obj) => {
        window.open(process.env.REACT_APP_APIURL +  obj.applicant_cv , '_blank');
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
                    <Breadcrumb home="Home" navigation="Application"/>
                </div>
                
                    <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <h6 className="font-weight-bold pt-3">Applications</h6>
                            </div>
                            <div className='col justify-content-end '>
                                <IconContext.Provider value={{ size: '30' }}>
                                <CSVLink data={filtered} filename="vacancy"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                                </IconContext.Provider>     
                            </div>
                        </div>
                    
                    
                        <MDBTable >
                        <MDBTableHead color="info-color" textWhite>
                            <tr>
                            <th style={{width:"5%"}}>Vacancy Id</th>
                            <th style={{width:"20%"}}>Name</th>
                            <th style={{width:"20%"}}>Contact</th>
                            <th style={{width:"25%"}}>Status</th>
                            <th style={{width:"15%"}}>Action</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            <tr style={{backgroundColor:"#33B5E5"}} >
                                <td><input onChange={(e)=>{filter(e,'vacancy');}} value={vacancy} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input onChange={(e)=>{filter(e,'name');}} value={name} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input onChange={(e)=>{filter(e,'contact');}} value={contact} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /> </td>
                                <td>
                                    <Form.Select style={{height:"30px", fontSize:"12px"}} name="status" onChange={(e)=>{filter(e,'status');}} value={status} required>
                                        <option value="-" hidden default={true}>--</option>
                                        <option value="shortlist"> Short List</option>
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
                                vacancys.map(item =>
                                    <tr key={item.id} >
                                        <td>{item.vacancy}</td>
                                        <td>{item.applicant_name}</td>
                                        <td>{item.applicant_email} <br/> {item.applicant_phone} </td>
                                        <td>
                                            {item.applicant_status === 'shortlist'? <Badge pill bg="success"> Short Listed</Badge> :
                                            item.applicant_status === 'rejected'? <Badge pill bg="danger"> Rejected</Badge> : 
                                            <Badge pill bg="warning"> Pending</Badge>} 
                                        </td>
                                        <td>
                                            <IconContext.Provider value={{ size: '20', color:"green" }}>
                                                <AiIcons.AiFillEdit onClick={() => handleEditShow(item.id)} />
                                                <GrIcons.GrView className='ml-3' onClick={() => showSelectedRow(item)} />
                                                <AiIcons.AiOutlineDownload  className='ml-3' onClick={() => downloadFile(item)}/>
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
            
            <Modal show={editShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Edit Application</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label >Vacancy Id</Form.Label >
                                <Form.Control disabled type="text" placeholder="Enter Vacancy Id" name="vacancy" defaultValue={selectedRecord.vacancy}/>  

                                <Form.Label >Applicant Name</Form.Label >
                                <Form.Control disabled type="text" placeholder="Enter Vacancy Id" name="vacancy" defaultValue={selectedRecord.applicant_name}/>  

                                <Form.Label >Applicant Email</Form.Label >
                                <Form.Control disabled type="text" placeholder="Enter Vacancy Id" name="vacancy" defaultValue={selectedRecord.applicant_email}/>  

                                <Form.Label >Applicant Phone</Form.Label >
                                <Form.Control disabled type="text" placeholder="Enter Vacancy Id" name="vacancy" defaultValue={selectedRecord.applicant_phone}/>  

                                <Form.Label >Status</Form.Label >
                                <Form.Select name="status"  defaultValue={selectedRecord.applicant_status} required>
                                    <option value="shortlist"> Short List</option>
                                    <option value="rejected">Reject</option>                                    
                                </Form.Select>                                  
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
                <Modal.Title >{selectedRecord.applicant_name}  </Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                    <   div className='row'>
                            <div className='col font-weight-bold'>Vacancy Id</div>
                            <div className='col'> : {selectedRecord.vacancy}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Applicant Name</div>
                            <div className='col'> : {selectedRecord.applicant_name}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Applicant Email</div>
                            <div className='col'> : {selectedRecord.applicant_email}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Applicant Phone</div>
                            <div className='col'> : {selectedRecord.applicant_phone}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Status</div>
                            <div className='col'> : {selectedRecord.applicant_status === 'shortlist'? <Badge pill bg="success"> Short Listed</Badge> :
                                                    selectedRecord.applicant_status === 'rejected'? <Badge pill bg="danger"> Rejected</Badge> : 
                                                    <Badge pill bg="warning"> Pending</Badge>} 
                            </div>
                        </div><br />

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
 
export default Applicant;