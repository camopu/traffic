import React from 'react';

const Flag = ({country, index, isActive, toggleCountry}) => {

    let activeCss = isActive === 'yes' ? 'active' : 'inactive';

    return (
        <div className={"flag-container"}>
            {isActive === 'no' &&
                <div className={"flag-container__inactive"}></div>
            }
            <img src={require(`../../resources/images/flags/${country}.svg`)} />
            <i className={`fas fa-times ${activeCss}`} data-index={index} onClick={toggleCountry}></i>
        </div>
    );
}

export default Flag;