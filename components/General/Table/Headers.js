import React from 'react'

const Headers = ({headers, activeColumn, activeOrder}) => {
    return(
        <thead>
            <tr>
                {headers &&
                    Object.keys(headers).map((element, key) => {

                        let clickable = false;

                        if(headers[element].onclick) {
                            clickable = true;
                        }

                        if(headers[element].sortColumn === activeColumn && activeColumn !== undefined) {
                            return (
                                <th key={key} data-col={headers[element].sortColumn} className={'clickable active'} onClick={headers[element].onclick}>
                                    {headers[element].text}
                                    <i className={activeOrder === 'ASC' ? 'fas fa-sort-up active' : 'fas fa-sort-up'}></i>
                                    <i className={activeOrder === 'DESC' ? 'fas fa-sort-down active' : 'fas fa-sort-down'}></i>
                                </th>
                            );
                        } else if(clickable === true) {
                            return (
                                <th key={key} data-col={headers[element].sortColumn} className={clickable ? 'clickable' : ''} onClick={headers[element].onclick}>
                                    {headers[element].text}
                                    <i className="fas fa-sort-up"></i>
                                    <i className="fas fa-sort-down"></i>
                                </th>
                            );
                        }

                        return  <th key={key}>{headers[element].text}</th>
                    })
                }
            </tr>
        </thead>
    )
}

export default Headers