import React from 'react'
import ChartistGraph from "react-chartist";
import Loader from '../General/Loader';

const TopArticles = ({data, loading, url1, url2, url3}) => {

    let options = {
        showArea: true,
        showPoint: false,
        fullWidth: true
    };

    let type = 'Line';

    if(loading === true) {
        return (
            <div className={"main-view-container__card dark-blue"}>
                <div className={"loader-container"}>
                    <Loader
                        size={"medium"}
                    />
                </div>
            </div>
        )
    } else if (url1 === undefined || url1.length <= 0) {
        return (
            <div className={"main-view-container__card dark-blue"}>
                <h1>
                    Top 3 articles this week
                </h1>
                <div className={"article-data-missing"}>
                    No data available, come back later!
                </div>
            </div>
        );
    } else {
        return (
            <div className={"main-view-container__card dark-blue"}>
                <h1>
                    Top 3 articles this week
                </h1>
                <div className={"article-url-container"}>
                    <div>{url1}</div>
                    <div>{url2}</div>
                    <div>{url3}</div>
                </div>
                <ChartistGraph data={data} options={options} type={type} />
            </div>
        );
    }
}

export default TopArticles;