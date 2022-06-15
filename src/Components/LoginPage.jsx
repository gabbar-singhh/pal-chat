import React, { useEffect, useState } from 'react';
import STYLED from 'styled-components';
import './LoginPage.css'
import LOGO from '../Assets/logo.png'
import GOOGLE_LOGO from '../Assets/google_logo.png';
import { auth } from '../firebase-config';
import { db } from '../firebase-config';
import AtIcon from '@mui/icons-material/AlternateEmail';
import { Button } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import ClearIcon from '@mui/icons-material/Clear';
import CHALK from 'chalk';

// GENERATING RANDOM NUMBER FROM 1 TO 6..... TO SET A RANDOM BACKGROUND-IMG
const getRandomNumberGenerator = () => {
    return Math.floor(Math.random() * 6) + 1;
}

const allowedUsername = (val) => {
    try {
        const regex = /[a-zA-Z0-9._]/gi
        const result = val.match(regex).join('');
        return result.toLowerCase();
    } catch (error) {
        console.log(CHALK.bold.red('Error!'));
    }

}

const LoginPage = () => {
    const [randomBGImgVal, setRandomBGImgVal] = useState();
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [disableGoogleBtn, setDisableGoogleBtn] = useState(true);
    const [newUsernameVal, setNewUsernameVal] = useState("");

    const signupHandler = () => {
        console.log('❄️', newUsernameVal)
        console.log('SIGN UP PROCESS STARTED !⚡');
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then((data) => {

                const userProfileColsRef = collection(db, 'users-Profile');
                const userIDColsRef = collection(db, 'users-ID');
                addDoc(userProfileColsRef, {
                    username: newUsernameVal,
                    uid: data.user.uid,
                    displayName: data.user.displayName,
                    email: data.user.email,
                    emailVerified: data.user.emailVerified,
                    photoURL: data.user.photoURL,
                    creationTime: data.user.metadata.creationTime
                }).then(() => {
                    addDoc(userIDColsRef, {
                        username: newUsernameVal,
                        email: data.user.email
                    }).then(() => {
                        console.log('PROFILE CREATED SUCESSFULLY ☠️')
                    }).catch((err_1) => {
                        console.log('👉 users-ID: ', err_1)
                    })

                }).catch((err2) => {
                    console.log('👉 userprofile: ', err2)
                })


            }).catch((err) => {
                console.log(err)
            })
    }

    const authUserHandler = () => {
        console.log('LOG IN PROCESS STARTED !⚡');
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then((data) => {

                const userColsRef = collection(db, 'user-Profiles');
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

    // SIGN UP DETAILS
    const newUsernameFieldHandler = (event) => {
        console.log('⭕ Allowed: ', allowedUsername(event.target.value))
        console.log('⭕ Def: ', event.target.value)
        setNewUsernameVal(allowedUsername(event.target.value))
        if (event.target.value.length >= 6) {
            setDisableGoogleBtn(false);
        } else if (event.target.value.length < 6) {
            setDisableGoogleBtn(true);
        }

    }

    const signupTxtHandler = () => {
        setShowLoginForm(false)
        setShowSignupForm(true)
    }

    const loginTxtHandler = () => {
        setShowLoginForm(true)
        setShowSignupForm(false)
    }

    const clearInputField = (event) => {
        setNewUsernameVal("")
    }

    useEffect(() => {
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
                            <Button
                                onClick={authUserHandler}
                                className='login_google_btn shineEff' variant='contained'>
                                <img src={GOOGLE_LOGO} alt="google_logo" height="40px" />

                                <span>
                                    Log in with Google
                                </span>
                            </Button>
                        </LOGIN_FORM>

                        <SWITCH_FORM_TYPE>
                            <p>Don't have an account? <span className='underlineEff' onClick={signupTxtHandler}>&nbsp;SIGN UP!</span></p>
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
                                    title="Username must only contain alphabets, underscore or periods"

                                />
                                <ClearIcon onClick={clearInputField} />

                            </USERNAME_PASSWORD>
                            <Button
                                onClick={signupHandler}
                                disabled={disableGoogleBtn}
                                title="Enter username then you'll be able to sign in through google"
                                className='login_google_btn shineEff' variant='contained'>
                                <img src={GOOGLE_LOGO} alt="google_logo" height="30px" />

                                <span>
                                    Sign in with Google
                                </span>
                            </Button>
                        </SIGNUP_FORM>

                        <SWITCH_FORM_TYPE>
                            <p>Already have an account? <span className='underlineEff' onClick={loginTxtHandler}>&nbsp;LOG IN!</span></p>
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
    cursor: pointer;
}
span {
    font-weight: 600;
    color: #232323;
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

    input ::-ms-clear {
    display: none;
}

::placeholder {
  color: lightgray;
}`

export default LoginPage;