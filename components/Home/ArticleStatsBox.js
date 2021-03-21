import React from 'react'
import ChartistGraph from "react-chartist";
import Loader from '../General/Loader';


const ArticleStatsBox = ({data, loading, title, faIcon, color, value, arrow, date}) => {

    let options = {
        axisX: {
            labelInterpolationFnc: function(value, index) {
                return index % 2 === 0 ? value : null;
            }
        }
    };

    let listener = {
        draw: ((data) => {
            if(data.type === "bar") {

                // If we get 0 we still want to show a tiny column so we edit the y2 value of the column
                if(data.value.y === 0) {
                    let data2 = data;

                    data2.element._node.attributes[3].value = 114;
                    data.element.replace(data2.element);
                }
            }
        })
    }

    let type = 'Bar';

    if(loading) {
        return (
            <div className={`main-view-container__card ${color}`}>
                <Loader
                    size={"medium"}
                />
            </div>
        )
    } else {
        return(
            <div className={`main-view-container__card ${color}`}>
                <div className={"main-view-container__home__bottom__inner"}>
                    <div className={"main-view-container__home__bottom__inner__left"}>
                        <i className={faIcon}></i>
                        <i className={arrow}></i>
                    </div>
                    <div className={"main-view-container__home__bottom__inner__middle"}>
                        <div className={"main-view-container__home__bottom__inner__middle__text"}>
                            <div className={"main-view-container__home__bottom__inner__middle__text__title"}>
                                <div>{title}</div>
                            </div>
                            <div className={"main-view-container__home__bottom__inner__middle__text__date"}>
                                {date}
                            </div>
                        </div>
                        <div className={"main-view-container__home__bottom__inner__middle__number"}>
                            <div>{value}</div>
                        </div>
                    </div>
                    <div className={"main-view-container__home__bottom__inner__right"}>
                        <div className={"main-view-container__home__bottom__inner__right__graph"}>
                            <ChartistGraph data={data} listener={listener} options={options} type={type} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default ArticleStatsBox;