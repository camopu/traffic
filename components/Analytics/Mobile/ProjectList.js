import React from 'react'
import {toJS} from 'mobx'

const ProjectList = ({projects}) => {
    return(
        projects.map((element, key) => {

            let projectId = Object.keys(element)[0];

            return Object.keys(element).map((element2, key) => {

                let project = element[element2];

                let color = 'pink';

                switch(project.status.class) {
                    case 'attention':
                        color = 'pink';
                        break;

                    case 'on-track':
                        color = 'yellow';
                        break;

                    case 'done':
                        color = 'success-green';
                        break;

                    case 'pre-launch':
                        color = 'blue';
                        break;
                }

                return(
                    <div key={key} className={`main-view-container__card ${color}`}>
                        <div className={"top"}>
                            <div>{projectId}</div>
                            <div>{project.status.text}</div>
                        </div>
                        <div className={"middle"}>
                            {project.name}
                        </div>
                        <div className={"bottom"}>
                            {project.readers_delivered} / {project.readers_sold} delivered
                        </div>
                    </div>
                );
            })

        })
    )
}
export default ProjectList;