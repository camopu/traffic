import React from 'react';
import { observer } from 'mobx-react';

import Loader from '../General/Loader';

import '../../styles/login.css';


const LoginContainer = (props) => {

    const {handleLogin, handlePassword, handleEmail, isClickable, error, processing} = props;

    return (
        <div className="login-container__left__inner">
            <div className={"login-container__left__inner__top"}>
                <h2>
                    SIGN IN
                </h2>
            </div>
            <form onSubmit={handleLogin} className="login-container__left__inner__form">
                <div>USERNAME</div>
                <input name={"email"} className={error.email ? 'error' : ''} onChange={handleEmail} type="text" placeholder="Email" />
                <div>PASSWORD</div>
                <input name={"password"} className={error.password ? 'error' : ''} onChange={handlePassword} type="password" placeholder={"x x x x x x x x"}/>
                <input type={"submit"} disabled={!isClickable} value={!processing ? 'Sign In' : ''} />
                {processing &&
                    <div className={"login-container__left__inner__form__loader"}>
                        <Loader
                            size={'small'}
                        />
                    </div>
                }
            </form>
            <a className={"animate"} href={"http://help.mediaplanet.com"} target={"_blank"}>Help</a>
        </div>
    );
}

export default observer(LoginContainer)