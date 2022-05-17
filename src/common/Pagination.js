import React from 'react';
import _ from 'lodash';

const Pagination = (props) => {

    const {itemsCount, pageSize, onPageChange, currentPage} = props;

    const pagesCount = Math.ceil(itemsCount/ pageSize);

    const pages = _.range(1, pagesCount + 1)

    if (pagesCount === 1) return null;

    if (itemsCount === 0) return null;

    return ( 
        <React.Fragment>
            <div className='row'>
                <div className='col'>
                    <p style={{ fontSize:"14px"}}>Showing {currentPage* pageSize - pageSize +1} to {currentPage* pageSize - pageSize +1 === itemsCount? itemsCount: currentPage*pageSize} of {itemsCount} entries</p>
                </div>

                <div className='col'>
                    <nav >
                        <ul className="pagination justify-content-end">
                            {
                                pages.map(page=>
                                <li key={page} className={page === currentPage ? "page-item active" : "page-item"}><a className="page-link" onClick={() => onPageChange(page)}>{page}</a></li>
                                )
                            }
                        </ul>
                    </nav>
                </div>
            </div>
            
        </React.Fragment>
     );
}
 
export default Pagination;