import React from 'react'

const Status = ({readersSold, readersDelivered, launchDate}) => {

    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth()+1;
    let year = currentDate.getFullYear();
    let today = `${year}-${month}-${day}`;

    let statuses = {
        good: {
            text: 'On track',
            cssClass: 'status on-track'
        },
        bad: {
            text: 'Attention',
            cssClass: 'status bad'
        },
        done: {
            text: 'Done',
            cssClass: 'status done'
        }
    };

    // Hold percent of delivered readers
    let deliveredPercent = (readersDelivered/readersSold)*100;


    // Status logic, most likely has to be defined by production
    if(deliveredPercent <= 5 && today > launchDate) {
        return (
            <div className={statuses.bad.cssClass}>
                {statuses.bad.text}
            </div>
        );
    } else if (deliveredPercent >= 100) {
        return (
            <div className={statuses.done.cssClass}>
                {statuses.done.text}
            </div>
        );
    } else {
        return (
            <div className={statuses.good.cssClass}>
                {statuses.good.text}
            </div>
        );
    }
}

export default Status;