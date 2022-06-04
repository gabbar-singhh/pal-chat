import React, { useEffect, useState } from 'react';
import STYLED from 'styled-components';
import './LoginPage.css'
import LOGO from '../Assets/logo.png'
import GOOGLE_LOGO from '../Assets/google_logo.png';
import { auth } from '../firebase-config';
import { db } from '../firebase-config';
import AtIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';
import { Button } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

// GENERATING RANDOM NUMBER FROM 1 TO 6..... TO SET A RANDOM BACKGROUND-IMG
const getRandomNumberGenerator = () => {
    return Math.floor(Math.random() * 6) + 1;
}

const allowedUsername = (val) => {
    const regex = /[a-zA-Z0-9._]/gi
    const result = val.match(regex).join('');
    return result.toLowerCase();
}

const LoginPage = () => {
    const [randomBGImgVal, setRandomBGImgVal] = useState();

    const [usernameVal, setUsernameVal] = useState('');
    const [passwdVal, setPasswdVal] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [newUsernameVal, setNewUsernameVal] = useState('');

    const googlBtnHandler = () => {
        console.log('SIGN IN PROCESS STARTED !⚡');
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then((data) => {

                const userColsRef = collection(db, 'userprofiles');
                addDoc(userColsRef, {
                    username: newUsernameVal,
                    uid: data.user.uid,
                    displayName: data.user.displayName,
                    email: data.user.email,
                    emailVerified: data.user.emailVerified,
                    photoURL: data.user.photoURL,
                    creationTime: data.user.metadata.creationTime
                }).then(() => {
                    console.log('PROFILE CREATED SUCESSFULLY ☠️')
                }).catch((err) => {
                    console.log(err)
                })

            }).catch((err) => {
                console.log(err)
            })
    }

    // LOGIN-IN HANDLERS
    const usernameFieldHandler = (event) => {
        setUsernameVal(event.target.value);
    }
    const passwdFieldHandler = (event) => {
        setPasswdVal(event.target.value);
    }

    const submitLoginHandler = () => {
        // DETAILS WILL BE SENT TO FIREBASE 🔥🤨
    }

    // SIGN UP DETAILS
    const newUsernameFieldHandler = (event) => {

        setNewUsernameVal(allowedUsername(event.target.value));
    }

    const signupTxtHandler = () => {
        setShowLoginForm(false)
        setShowSignupForm(true)
    }

    const loginTxtHandler = () => {
        setShowLoginForm(true)
        setShowSignupForm(false)
    }

    useEffect(() => {
        console.log(auth)
        setRandomBGImgVal(getRandomNumberGenerator())
    }, [])

    return (
        <section className={`loginpage_section ${'backgroundImg-' + randomBGImgVal}`}>
            <div className="login_form">

                <div className='logo_span'>
                    <img src={LOGO} alt="palchat-logo" height="125px" />
                </div>

                {showLoginForm &&
                    <>
                        <LOGIN_FORM action="">
                            <USERNAME_PASSWORD>
                                <AtIcon />
                                <INPUT
                                    type="search"
                                    value={usernameVal}
                                    onChange={usernameFieldHandler}
                                    placeholder="username"
                                    spellCheck="false"
                                />
                            </USERNAME_PASSWORD>
                            <USERNAME_PASSWORD>
                                <KeyIcon />
                                <INPUT
                                    type="password"
                                    value={passwdVal}
                                    onChange={passwdFieldHandler}
                                    placeholder="password"
                                />
                            </USERNAME_PASSWORD>
                            <Button
                                type='submit'
                                className='login-submitBtn shineEff'
                                variant='contained'
                                onClick={submitLoginHandler}
                                disabled={!usernameVal || !passwdVal}
                            >
                                Log In
                            </Button>
                        </LOGIN_FORM>

                        <SWITCH_FORM_TYPE>
                            <p>Don't have an account? <span onClick={signupTxtHandler}>&nbsp;SIGN UP!</span></p>
                        </SWITCH_FORM_TYPE>
                    </>}

                {showSignupForm &&
                    <>
                        <SIGNUP_FORM>
                            <USERNAME_PASSWORD>
                                <AtIcon />
                                <INPUT
                                    type="search"
                                    value={newUsernameVal}
                                    onChange={newUsernameFieldHandler}
                                    placeholder="username"
                                    spellCheck="false"
                                />
                            </USERNAME_PASSWORD>
                            <Button
                                onClick={googlBtnHandler}
                                disabled={newUsernameVal.length !== 6}
                                className='login_google_btn' variant='contained'>
                                <img src={GOOGLE_LOGO} alt="google_logo" height="30px" />

                                <span>
                                    Sign in with Google
                                </span>
                            </Button>

                            <p className='signInErrorMssg'>
                                {'redErrorBelowMssg'}
                            </p>
                        </SIGNUP_FORM>

                        <SWITCH_FORM_TYPE>
                            <p>Already have an account? <span onClick={loginTxtHandler}>&nbsp;LOG IN!</span></p>
                        </SWITCH_FORM_TYPE>
                    </>}
            </div>
        </section >
    )

}

const SIGNUP_FORM = STYLED.form`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
`

const SWITCH_FORM_TYPE = STYLED.div`
margin-top: 1.5em;
background-color: #fff;
padding: 0.5em 1em;
border-radius: 1em;
box-shadow: 3px 3px 5px #48484817;

p{
    color: #898989;
    cursor: default;
}
span {
    font-weight: 600;
    color: #232323;
}

span:hover {
    cursor: pointer;
    transition: all 500ms ease-in;
    text-decoration: underline;
}
`

const USERNAME_PASSWORD = STYLED.div`
display: flex;
align-items: center;
justify-content:center;
background-color: #fff;
color: lightgray;
border-radius: 0.5rem;
padding: 0.5em 0.6em;
margin-bottom: 0.5em;
box-shadow: 3px 3px 5px #cbc8c85e;
width: 89%;
`

const LOGIN_FORM = STYLED.form`
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}

  border-radius: 0.5rem;
  padding: 0.3em 0.3em;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;


@media screen and (min-width: 0px) and (max-width: 360px) {
    margin: 1em 0.8em;
}

@media screen and (min-width: 360px) and (max-width: 480px) {
    margin-right: 1em;
}

@media screen and (min-width: 481px) and (max-width: 768px) {
    margin-right: 1em;
}
`

const INPUT = STYLED.input`
  padding: 0.2em 0.2em;
  color: #232323b3;
  outline: none;
  font-size: 1em;
  border-radius: 0.5rem;
  text-decoration: none;
  border: none;
  width: 100%;

::placeholder {
  color: lightgray;
}
`

export default LoginPage;