import React from 'react';
import { observer, inject } from 'mobx-react'
import { action, observable, toJS } from 'mobx'

import Loader from '../../General/Loader';
import Button from '../../General/Button';
import Popup from '../../General/Popup';
import Pagination from '../../General/Table/Pagination';
import Headers from '../../General/Table/Headers';


@inject('adminStore', 'filterStore')
@observer
export default class ArchiveTable extends React.Component {

    @observable unarchiveProjectId = null;

    @action setProjectId(id) {
        this.unarchiveProjectId = id;
    }

    componentDidMount() {
        this.unarchiveProjectId = null;
    }

    render() {

        const { headers } = this.props;

        if(this.props.adminStore.processing === true) {
            return(
                <Loader
                    size={"medium"}
                />
            )
        }

        return(
            <div className={"main-view-container__card__table__inner"}>

                {this.unarchiveProjectId > 0 &&
                    <Popup
                        msg={'This will move the project to the analytics overview, are you sure?'}
                        type={'options'}
                        clickHandler={() => {
                            this.props.adminStore.unarchiveProject(this.unarchiveProjectId);
                            this.unarchiveProjectId = null;
                        }}
                        denyClickHandler={() => this.unarchiveProjectId = null}
                    />
                }

                {this.props.adminStore.archivedProjects.length > 0 &&
                    <table>
                        <Headers
                            headers={headers}
                        />
                        <tbody>
                            {this.props.adminStore.archivedProjects.map((project, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{project.name} ({project.id})</td>
                                        <td>{project.pm}</td>
                                        <td>
                                            <Button
                                                type={'remove'}
                                                value={'Restore'}
                                                clickHandler={() => this.setProjectId(project.id)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                }
                {this.props.adminStore.archivedProjects.length <= 0 &&
                    <div className={"error"}>
                        No archived projects found!
                    </div>
                }
                <div className={"main-view-container__card__table__inner__bottom"}>
                    <Pagination
                        page={this.props.adminStore.currentArchivePage}
                        pages={this.props.adminStore.archivePages}
                        total={this.props.adminStore.totalArchivedProjects}
                        pageClick={this.props.adminStore.setArchivePage}
                        timestamp={this.props.adminStore.timestamp}
                    />
                </div>
            </div>
        )
    }
}