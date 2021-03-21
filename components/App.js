import React from 'react';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';

import Login from './Login/Index';
import Sidebar from './General/Sidebar';
import agent from '../agent';

import '../styles/index.css';
import Home from "./Home/Index";
import Analytics from "./Analytics/Index";
import Admin from "./Admin/Index";
import Archive from "./Admin/Archive/Index";
import Settings from "./Settings/Index";

@inject('generalStore', 'authStore', 'userStore')
@withRouter
@observer
export default class App extends React.Component {

    constructor(props) {
        super(props);
        /* If user token set app loaded, else check for user, set token, set app loaded */
        document.getElementById('pre-dom').outerHTML = '';

        reaction(
            () => props.generalStore.token,
            token => {
                if(token) {
                    agent.Auth.getUser().then(resp => {
                        props.userStore.currentUser = resp.data.user;
                    }).finally(() => {
                        props.userStore.setUserLoaded();
                    })
                }
            }
        );

        // Triggers on manual browser refresh
        if(props.generalStore.token) {
            agent.Auth.getUser().then(resp => {
                props.userStore.currentUser = resp.data.user;
            }).finally(() => {
                props.userStore.setUserLoaded();
            })
        };

       
    }

    componentWillUnmount() {
        this.props.history.listen((location, action) => {
            if (location.pathname === '/home') {
                setTimeout(() => controller.abort(), 0);
            }
        });
      }

    render() {
        if(!this.props.generalStore.token) {
            return (
                <Login/>
            );
        }

        return (
            /* Show sidebar, add routes for each  */
            <div className={"main-container"}>
                <Sidebar />
                <Switch>
                    <Route path={"/home"} component={Home} />
                    <Route path={"/settings"} component={Settings} />
                    <Route exact path={"/analytics/overview"} component={Analytics} />
                    <Route exact path={"/admin/users"} component={Admin} />
                    <Route exact path={"/admin/archive"} component={Archive} />

                    <Route render={() =>(
                        <Redirect to="/home" />
                    )} />
                </Switch>
            </div>
        );
    }
}