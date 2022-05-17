import React from 'react';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';

const Breadcrumb = (props) => {

    const {home,navigation} = props;



    return ( 
        <React.Fragment>
            <div >
                <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                <IconContext.Provider value={{ size: '18' }} >
                    
                    <li className="breadcrumb-item text-primary" style={{fontSize:"15px"}}> <FaIcons.FaHome /> <a >{home}</a></li>
                    <li className="breadcrumb-item text-primary" style={{fontSize:"15px"}}><a >{navigation}</a></li>

                </IconContext.Provider>    
                </ol>
                </nav>
            </div>
        </React.Fragment>
     );
}
 
export default Breadcrumb;