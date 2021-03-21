import React from 'react';

const Loader = ({size}) => {

    const sizes = {
        small: '2rem',
        medium: '4rem',
        large: '8rem'
    };

    return (
        <div className={"loader-container"} style={{height: sizes[size]}}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
                 preserveAspectRatio="xMidYMid" className="lds-bar-chart">
                <g transform="rotate(180 50 50)">
                    <rect ng-attr-x="{{config.x1}}" y="15" ng-attr-width="{{config.width}}" height="30.3809" fill="#39a5e4"
                          x="15" width="10">
                        <animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1"
                                 dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.4s"
                                 repeatCount="indefinite"></animate>
                    </rect>
                    <rect ng-attr-x="{{config.x2}}" y="15" ng-attr-width="{{config.width}}" height="49.2751" fill="#404040"
                          x="35" width="10">
                        <animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1"
                                 dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.2s"
                                 repeatCount="indefinite"></animate>
                    </rect>
                    <rect ng-attr-x="{{config.x3}}" y="15" ng-attr-width="{{config.width}}" height="46.9068" fill="#facc02"
                          x="55" width="10">
                        <animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1"
                                 dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.6s"
                                 repeatCount="indefinite"></animate>
                    </rect>
                    <rect ng-attr-x="{{config.x4}}" y="15" ng-attr-width="{{config.width}}" height="69.7487" fill="#e61a7a"
                          x="75" width="10">
                        <animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1"
                                 dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="0s"
                                 repeatCount="indefinite"></animate>
                    </rect>
                </g>
            </svg>
        </div>
    );
}

export default Loader;