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

const Notice = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtered, setFiltered] = useState([]);
    const [data, setData] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [showModalSelectedRow, setShowModalSelectedRow] = useState(false);
    const [user, token, userRole, pageSize] = useContext(UserContext);
    const axios = require('axios');

    const [noticeType, setNoticeType] = useState('');
    const [noticeTitle, setNoticeTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('-');

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const response = await axios.get(process.env.REACT_APP_APIURL + '/noticeboard', { params: { token: token } });
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
    
    const handleAddShow = () => setAddShow(true);

    const handleEditShow = (id) => {
        setEditShow(true); 
        let record = data.filter(item=> item.id === parseInt(id)); 
        setSelectedRecord(record[0]);
    };

    const handleModalClose = () => {setEditShow(false); setShowModalSelectedRow(false); setAddShow(false) ; setSelectedRecord([]) ; };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    noticeType : e.target.noticeType.value,
                    noticeTitle : e.target.noticeTitle.value,
                    noticeDate : e.target.noticeDate.value,
                    description : e.target.description.value,
                    isShow :e.target.status.value,
                    createdBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/noticeboard', requestOptions)
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
            toast.error("Failed to add new notice");
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
                    noticeType : e.target.noticeType.value,
                    noticeTitle : e.target.noticeTitle.value,
                    noticeDate : e.target.noticeDate.value,
                    description : e.target.description.value,
                    isShow :e.target.status.value,
                    modifiedBy : user,
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/noticeboard', requestOptions)
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
            toast.error("Failed to edit notice");
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

        if(column=='noticeType' ){
            setNoticeType(res)
            filteredARR = filteredARR.filter(notice => notice.noticeType.toLowerCase().includes(res));
            setFiltered(filteredARR) 
        }

        if(column=='noticeTitle' ){
            setNoticeTitle(res)
            filteredARR = filteredARR.filter(notice => notice.noticeTitle.toLowerCase().includes(res));
            setFiltered(filteredARR)
        }

        if(column=='description' ){
            setDescription(res)
            filteredARR = filteredARR.filter(notice => notice.description.toLowerCase().includes(res));
            setFiltered(filteredARR)
        }

        if(column=='status'){
            setStatus(res)
            filteredARR = filteredARR.filter(notice => notice.isShow==res);
            setFiltered(filteredARR)
        }

        // ************************************Other columns Filter*********************

        if(noticeType != "" && column!='noticeType'){
            filteredARR = filteredARR.filter(notice => notice.noticeType.toLowerCase().includes(noticeType));
            setFiltered(filteredARR)   
        }

        if(noticeTitle != "" && column!='noticeTitle'){
            filteredARR = filteredARR.filter(notice => notice.noticeTitle.toLowerCase().includes(noticeTitle));
            setFiltered(filteredARR)
        }

        if(description != "" && column!='description'){
            filteredARR = filteredARR.filter(notice => notice.description.toLowerCase().includes(description));
            setFiltered(filteredARR)   
        }

        if(status != "-" && column!='status'){
            filteredARR = filteredARR.filter(notice => notice.isShow==status);
            setFiltered(filteredARR)
        }
       
    }
    
    const resetFilter = (e) =>{
        setFiltered(data)
        setNoticeTitle('')
        setNoticeType('')
        setDescription('')
        setStatus('-')
    }

    const showSelectedRow = (item) => {
        setShowModalSelectedRow(true)
        setSelectedRecord(item)
    }
     
    let notices = Paginate(filtered, currentPage, pageSize)


    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Notice Board"/>
                </div>

                {data.length>0
                    ? 
                    <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <h6 className="font-weight-bold pt-3">Notice Board</h6>
                            </div>
                            <div className='col justify-content-end '>
                                <IconContext.Provider value={{ size: '30' }}>
                                <Button type="button " className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={handleAddShow}><IoIcons.IoMdAddCircleOutline />Add New Notice</Button>
                                <CSVLink data={filtered} filename="Notice"><Button type="button " className="btn-sm btn-info float-right mt-3  ml-3 mb-1" ><AiIcons.AiOutlineDownload />Download as CSV</Button></CSVLink>
                                </IconContext.Provider>     
                            </div>
                        </div>

                        <MDBTable >
                        <MDBTableHead color="info-color" textWhite>
                            <tr>
                            <th style={{width:"5%"}}>#</th>
                            <th style={{width:"10%"}}>Notice Type</th>
                            <th style={{width:"15%"}}>Notice Title</th>
                            <th style={{width:"25%"}}>Description</th>
                            <th style={{width:"15%"}}>Notice Date</th>
                            <th style={{width:"15%"}}>Status</th>
                            <th style={{width:"15%"}}>Action</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            <tr style={{backgroundColor:"#33B5E5"}} >
                                <td ></td>
                                <td><input onChange={(e)=>{filter(e,'noticeType');}} value={noticeType} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input onChange={(e)=>{filter(e,'noticeTitle');}} value={noticeTitle} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
                                <td><input onChange={(e)=>{filter(e,'description');}} value={description} style={{height:"25px"}} type="text"  className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" /></td>
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
                                notices.map(item =>
                                    <tr key={item.id} >
                                    <td>{item.id}</td>
                                    <td>{item.noticeType}</td>
                                    <td>{item.noticeTitle}</td>
                                    <td>{item.description}</td>
                                    <td>{item.noticeDate}</td>
                                    <td>
                                        {item.isShow === '1'? <Badge pill bg="success"> Active</Badge> : <Badge pill bg="danger"> Inactive</Badge>} 
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
                    : <div></div>
                }
            </div>
            
            <Modal show={addShow} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Add New Notice</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleAddSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label>Notice Type</Form.Label>
                                <Form.Control type="text" placeholder="Enter Notice Type" name="noticeType" required/>  

                                <Form.Label>Notice Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter Notice Title" name="noticeTitle" required/>  

                                <Form.Label>Notice Date</Form.Label>
                                <Form.Control type="date" placeholder="Enter Notice Date" name="noticeDate" required/>  

                                <Form.Label>description</Form.Label>
                                <Form.Control type="text" placeholder="Enter description" name="description" required/>   

                                <Form.Label >Status</Form.Label >
                                <Form.Select name="status" required>
                                    <option value="-" hidden default={true}>--</option>
                                    <option value="1">Active</option>
                                    <option value="0"> In Active</option>
                                </Form.Select>

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
                <Modal.Title>Edit Notice</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" >
                                <Form.Label>Notice Type</Form.Label>
                                <Form.Control type="text" placeholder="Enter Notice Type" name="noticeType" defaultValue={selectedRecord.noticeType}/>  
                                
                                <Form.Label>Notice Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter Notice Title" name="noticeTitle" defaultValue={selectedRecord.noticeTitle}/>  
                                
                                <Form.Label>Notice Date</Form.Label>
                                <Form.Control type="date" placeholder="Enter Notice Date" name="noticeDate" defaultValue={selectedRecord.noticeDate}/>  

                                <Form.Label>description</Form.Label>
                                <Form.Control type="text" placeholder="Enter description" name="description" defaultValue={selectedRecord.description}/>   

                                <Form.Label >isShow</Form.Label >
                                <Form.Select name="status" defaultValue={selectedRecord.isShow}>
                                    <option value="1">Active</option>
                                    <option value="0">InActive</option>
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
                <Modal.Title >{selectedRecord.noticeType}</Modal.Title>
                </Modal.Header>                    
                    <Modal.Body>
                    <   div className='row'>
                            <div className='col font-weight-bold'>Id</div>
                            <div className='col'> : {selectedRecord.id}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Notice Type</div>
                            <div className='col'> : {selectedRecord.noticeType}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Notice Title</div>
                            <div className='col'> : {selectedRecord.noticeTitle}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Notice Date</div>
                            <div className='col'> : {selectedRecord.noticeDate}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>Description</div>
                            <div className='col'> : {selectedRecord.description}</div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold'>isShow</div>
                            <div className='col'> : {selectedRecord.isShow  === '1'? <Badge pill bg="success"> Active</Badge> : <Badge pill bg="danger"> Inactive</Badge>}</div>
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
 
export default Notice;