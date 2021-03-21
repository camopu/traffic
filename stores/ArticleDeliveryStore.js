import { observable, action } from 'mobx';

import agent from '../agent';
import {toJS} from "mobx/lib/mobx";

class ArticleDeliveryStore {

    @observable today = '';
    @observable articles = {
        underperforming: {
            loading: true,
            series: [],
        },
        done: {
            loading: true,
            series: [],
        },
        launching: {
            loading: true,
            series: [],
        },
        top: {
            loading: true,
            labels: [],
            series: [],
            urls: []
        }
    }

    @action getTop() {

        this.articles.top.loading = true;

        let first = true;

        this.articles.top.labels = [];
        this.articles.top.series = [];
        this.articles.top.urls = [];

        if(window.location.pathname === '/home') {
            return agent.Requests.get('/analytics/top-articles/').then(resp => {
                if(resp.data.length !== 0) {
                    Object.keys(resp.data.articles).forEach((article) => {

                        // Hold url
                        this.articles.top.urls.push(article);

                        // Hold article pageview array
                        let array = [];

                        // Get our labels for the graph
                        if(first) {
                            Object.keys(resp.data.articles[article]).forEach((day) => {
                                this.articles.top.labels.push(day);
                            });
                            first = false;
                        }

                        Object.keys(resp.data.articles[article]).forEach((day) => {
                            array.push(resp.data.articles[article][day].pageviews);
                        });
                        this.articles.top.series.push(array)
                    });
                }
            });
        }
    }

    @action getUnderperforming() {
        this.articles.underperforming.loading = true;
        if(window.location.pathname === '/home') {
            return agent.Requests.get('/analytics/underperforming-articles/').then(resp => {
                if(resp.data.length !== 0) {
                    this.articles.underperforming.series = resp.data.articles;
                    this.today = resp.data.date;
                }
            });
        }
    }

    @action getDone() {
        this.articles.done.loading = true;
        if(window.location.pathname === '/home') {
            return agent.Requests.get('/analytics/done-articles/').then(resp => {
                if(resp.data.length !== 0) {
                    this.articles.done.series = resp.data.articles;
                    this.today = resp.data.date;
                }
            });
        }
    }

    @action getLaunching() {
        this.articles.launching.loading = true;
        if(window.location.pathname === '/home') {
            return agent.Requests.get('/analytics/launching-articles/').then(resp => {
                if(resp.data.length !== 0) {
                    this.articles.launching.series = resp.data.articles;
                    this.today = resp.data.date;
                }
            });
        }
    }

    @action stopLoading() {
        this.articles.top.loading = false;
    }
}

export default new ArticleDeliveryStore();