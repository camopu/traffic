import React from 'react'

const NoAccess = ({msg}) => {
    return (
        <div className="main-view-container">
            <div className={"no-access"}>
                <div>
                    {msg}
                </div>
            </div>
        </div>
    )
}

export default NoAccess