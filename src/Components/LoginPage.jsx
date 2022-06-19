import React, { useEffect, useState } from 'react';
import STYLED from 'styled-components';
import './LoginPage.css'
import LOGO from '../Assets/logo.png'
import GOOGLE_LOGO from '../Assets/google_logo.png';
import { auth } from '../firebase-config';
import { db } from '../firebase-config';
import { Button } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import CHALK from 'chalk';

import HUMAN_2 from '../Assets/human_3d/2.png'
import HUMAN_3 from '../Assets/human_3d/3.png'

// GENERATING RANDOM NUMBER FROM 1 TO 6..... TO SET A RANDOM BACKGROUND-IMG
const getRandomNumberGenerator = () => {
    return Math.floor(Math.random() * 3) + 1;
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
    const [newUsernameVal, setNewUsernameVal] = useState("");
    const [showUsernameDialog, setShowUsernameDialog] = useState(true);

    const authUserHandler = () => {
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


    // SIGN UP DETAILS
    const clearInputField = (event) => {
        setNewUsernameVal("")
    }

    useEffect(() => {
        setRandomBGImgVal(getRandomNumberGenerator())
    }, [])

    return (
        <section className={`loginpage_section ${'backgroundImg-' + randomBGImgVal}`}>

            {randomBGImgVal === 2 && <img src={HUMAN_2} className="human human2" alt="" />}
            {randomBGImgVal === 3 && <img src={HUMAN_3} className="human human3" alt="" />}

            <div className="login_form">

                <div className='logo_span'>
                    <img src={LOGO} alt="palchat-logo" height="125px" />
                </div>
                {!showUsernameDialog &&
                    <LOGIN_FORM action="">
                        <Button
                            onClick={authUserHandler}
                            className='login_google_btn bubbleEff' variant='contained'>
                            <img src={GOOGLE_LOGO} alt="google_logo" height="40px" />

                            <span>
                                Log in with Google
                            </span>
                        </Button>
                    </LOGIN_FORM>
                }

                {showUsernameDialog &&
                    <LOGIN_FORM>
                        
                    </LOGIN_FORM>}

            </div>
        </section >
    )

}

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

export default LoginPage;