import React from 'react'

const Pagination = ({page, pages, total, pageClick, timestamp}) => {

    let links = [];

    for(let i = 1; i <= pages; i++) {
        links.push(<option key={i} value={i}>Page {i}</option>)
    }

    return(
        <div className={"pagination"}>
            <div className={"pagination__links"}>
                    {links.length > 0 &&
                        <div>
                            <select value={page} onChange={pageClick}>
                                {links}
                            </select>
                            &nbsp;of {links.length}
                        </div>
                    }
                </div>

            <div className={"pagination__total"}>
                <div>
                    Total: {total}
                </div>
                <div>
                    <em>View loaded @ {timestamp}</em>
                </div>
            </div>
        </div>
    )
}

export default Pagination