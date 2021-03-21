import React from 'react'

import Status from './Status';
import {toJS} from 'mobx';

const TableRow = ({id, project, activeProjects, clickHandler, editClick, editingRow, archiveProject}) => {

    return (
        <tr>
            {
                Object.keys(project).map((data, key) => {
                    return Object.keys(project[data]).map((projectData, key) => {
                        if (projectData === 'end_date' || projectData === 'sales_count') {
                            return null
                        }

                        if (projectData === 'sales') {
                            return (
                                <td key={key}>
                                    {project[data]['sales_count']}
                                </td>
                            )
                        } else if (projectData === 'name') {
                            return (
                                <td key={key}>
                                    <i onClick={clickHandler} data-project={id}
                                       className={activeProjects.includes(id) ? 'fas fa-angle-down' : 'fas fa-angle-right'}></i> {project[data][projectData]}
                                </td>
                            )
                        } else if (projectData === 'status') {
                            return (
                                <td key={key}>
                                    <div className={`status ${project[data][projectData].class}`}>
                                        {project[data][projectData].text}
                                    </div>
                                    <i className={"menu fas fa-ellipsis-v"} data-project={id} onClick={editClick}></i>

                                    {editingRow === id &&
                                    <div className={"main-view-container__card__table__inner__usermenu"}>
                                        <ul>
                                            <li data-project={id} onClick={archiveProject}><i
                                                className={"fas fa-archive"}></i>Archive
                                            </li>
                                        </ul>
                                    </div>
                                    }
                                </td>
                            )
                        } else {
                            return (
                                <td key={key}>
                                    {project[data][projectData]}
                                </td>
                            )
                        }
                    });
                })}
        </tr>
    )
}

export default TableRow