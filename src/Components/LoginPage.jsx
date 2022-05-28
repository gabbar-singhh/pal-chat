import React from 'react';
import './LoginPage.css'
import LOGO from '../Assets/logo.png'
import GOOGLE_LOGO from '../Assets/google_logo.png';
import FB_LOGO from '../Assets/facebook_logo.png'

const LoginPage = () => {
    return (
        <section className='loginpage_section'>
            <div className="login_form">

                <div className='logo_span'>
                    <img src={LOGO} alt="palchat-logo" height="125px" />
                </div>

                <div className="login_google_btn">
                    <img src={GOOGLE_LOGO} alt="google_logo" height="52px" />
                    <span>
                        Sign in with Google
                    </span>
                </div>

                <div className="login_facebook_btn">
                    <img src={FB_LOGO} alt="fb_logo"
                        height="36px" />
                    <span>
                        Sign in with Facebook
                    </span>
                </div>

            </div>
        </section>
    )
}

export default LoginPage;