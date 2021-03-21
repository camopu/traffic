import React from 'react';
import { observer, inject } from 'mobx-react';
import { reaction, observable, toJS } from "mobx";
import ChartistGraph from "react-chartist";

import Loader from '../General/Loader';
import Changelog from '../General/Changelog';
import changelog from '../../resources/changelog.md';

import '../../styles/chartist.css';
import agent from "../../agent";
import TopArticles from "./TopArticles";
import ArticleStatsBox from "./ArticleStatsBox";

@inject('generalStore', 'userStore', 'articleDeliveryStore')
@observer
export default class Home extends React.Component {

    @observable isLoading = true;
    @observable today = '';
    @observable changelogText = null;
    @observable loadingChangelog = true;
    @observable topArticleData = {};
    @observable topArticleUrls = {};
    @observable underperformers = {
        series: [],
        yesterday: 0,
        today: 0
    };
    @observable done = {
        series: [],
        yesterday: 0,
        today: 0
    };
    @observable launching = {
        series: [],
        yesterday: 0,
        today: 0
    };

    constructor(props) {
        super(props)

        if(props.userStore.currentUser) {
            this.isLoading = false;
        }

        // Get changelog
        fetch(changelog).then(resp => resp.text()).then(text => {
            this.changelogText = text;
        }).finally(() => {
            this.loadingChangelog = false;
        });

        reaction(
            () => props.userStore.currentUser,
            user => {
                if(user) {
                    this.isLoading = false;
                } else {
                    this.isLoading = true;
                }
            }
        )
    }

    componentDidMount() {

        // Load article performance stuff
        this.props.articleDeliveryStore.getTop().finally(() => {
            this.topArticleData = {
                labels: this.props.articleDeliveryStore.articles.top.labels,
                series: this.props.articleDeliveryStore.articles.top.series
            };

            this.topArticleUrls = {
                first: (this.props.articleDeliveryStore.articles.top.urls.length > 0 ? this.props.articleDeliveryStore.articles.top.urls[0] : ''),
                second: (this.props.articleDeliveryStore.articles.top.urls.length > 0 ? this.props.articleDeliveryStore.articles.top.urls[1] : ''),
                last: (this.props.articleDeliveryStore.articles.top.urls.length > 0 ? this.props.articleDeliveryStore.articles.top.urls[2] : '')
            };

            this.today = this.props.articleDeliveryStore.today;
            this.props.articleDeliveryStore.articles.top.loading = false;
        });

        this.props.articleDeliveryStore.getUnderperforming().finally(() => {
            if(this.props.articleDeliveryStore.articles.underperforming.series.length > 0) {
                this.underperformers.series = this.props.articleDeliveryStore.articles.underperforming.series;
                this.underperformers.today = this.underperformers.series[0][6];
                this.underperformers.yesterday = this.underperformers.series[0][5];
            }
            this.props.articleDeliveryStore.articles.underperforming.loading = false;
        });

        this.props.articleDeliveryStore.getDone().finally(() => {
            if(this.props.articleDeliveryStore.articles.done.series.length > 0) {
                this.done.series = this.props.articleDeliveryStore.articles.done.series;
                this.done.today = this.done.series[0][6];
                this.done.yesterday = this.done.series[0][5];
            }
            this.props.articleDeliveryStore.articles.done.loading = false;
        });

        this.props.articleDeliveryStore.getLaunching().finally(() => {
            if(this.props.articleDeliveryStore.articles.launching.series.length > 0) {
                this.launching.series = this.props.articleDeliveryStore.articles.launching.series;
                this.launching.today = this.launching.series[0][6];
                this.launching.yesterday = this.launching.series[0][5];
            }
            this.props.articleDeliveryStore.articles.launching.loading = false;
        });
    }

    render() {

        if(this.isLoading) {
            return (
                <div className={"loader-container"}>
                    <Loader
                        size={"large"}
                    />
                </div>
            );
        }

        return (
            <div className="main-view-container">
                <div className={"main-view-container__home"}>
                    <div className={"main-view-container__home__top"}>
                        <div className={"main-view-container__home__top__left"}>
                                <TopArticles
                                    data={this.topArticleData}
                                    loading={this.props.articleDeliveryStore.articles.top.loading}
                                    url1={this.topArticleUrls.first}
                                    url2={this.topArticleUrls.second}
                                    url3={this.topArticleUrls.last}
                                />
                        </div>
                        <div className={"main-view-container__home__top__right"}>
                            <div className={"main-view-container__card dark-blue"}>
                                {!this.loadingChangelog &&
                                    <Changelog
                                        text={this.changelogText}
                                    />
                                }
                                {this.loadingChangelog &&
                                    <Loader
                                        size={"medium"}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className={"main-view-container__home__bottom"}>

                        <ArticleStatsBox
                            loading={this.props.articleDeliveryStore.articles.underperforming.loading}
                            data={this.underperformers}
                            title={"Articles underperforming"}
                            color={"pink"}
                            faIcon={"fas fa-bolt"}
                            arrow={this.underperformers.today > this.underperformers.yesterday ? "fas fa-chevron-up" : this.underperformers.today < this.underperformers.yesterday ? "fas fa-chevron-down" : "fas fa-minus"}
                            value={this.underperformers.today === 0.1 ? 0 : this.underperformers.today}
                            date={this.today}
                        />
                        <ArticleStatsBox
                            loading={this.props.articleDeliveryStore.articles.done.loading}
                            data={this.done}
                            title={"Articles done today"}
                            color={"success-green"}
                            faIcon={"far fa-thumbs-up"}
                            arrow={this.done.today > this.done.yesterday ? "fas fa-chevron-up" : this.done.today < this.done.yesterday ? "fas fa-chevron-down" : "fas fa-minus"}
                            value={this.done.today === 0.1 ? 0 : this.done.today}
                            date={this.today}
                        />
                        <ArticleStatsBox
                            loading={this.props.articleDeliveryStore.articles.launching.loading}
                            data={this.launching}
                            title={"Articles launching today"}
                            color={"blue"}
                            faIcon={"fas fa-rocket"}
                            arrow={this.launching.today > this.launching.yesterday ? "fas fa-chevron-up" : this.launching.today < this.launching.yesterday ? "fas fa-chevron-down" : "fas fa-minus"}
                            value={this.launching.today === 0.1 ? 0 : this.launching.today}
                            date={this.today}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
