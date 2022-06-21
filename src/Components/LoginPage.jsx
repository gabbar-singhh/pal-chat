import React, { useEffect, useState } from 'react';
import STYLED from 'styled-components';
import './LoginPage.css'
import LOGO from '../Assets/logo.png'
import GOOGLE_LOGO from '../Assets/google_logo.png';
import { auth } from '../firebase-config';
import { db } from '../firebase-config';
import { Button } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import CHALK from 'chalk';
import AtIcon from '@mui/icons-material/AlternateEmail';
import CrossIcon from '@mui/icons-material/Clear';
import TickIcon from '@mui/icons-material/Done';

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
        console.log(error)
    }

}

const LoginPage = () => {
    const [randomBGImgVal, setRandomBGImgVal] = useState("");
    const [newUsernameVal, setNewUsernameVal] = useState("");

    const [showGoogleBtn, setShowGoogleBtn] = useState(true);
    const [showUsernameDialog, setShowUsernameDialog] = useState(false);
    const [showCross, setShowCross] = useState(false);
    const [showTick, setShowTick] = useState(false)


    const authUserHandler = () => {
        console.log("🔐")
        const emailListArr = [];

        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then((data) => {

                //FULL DETAILS ABOUT USERS 
                const userProfileColsRef = collection(db, 'users-Profile');

                //ONLY USERNAME AND EMAIL-ID 
                const colRef = collection(db, "users-ID");

                getDocs(colRef).then((snapshot) => {
                    snapshot.docs.forEach(element => {
                        emailListArr.push(element.data().email)
                    });
                })

                // console.log(data.user.email)
                if (emailListArr.includes(data.user.email)) {
                    console.log(CHALK.red("Account already exists!"))
                    //ACCOUNT ALREADY EXISTS, SO NO NEED TO SHOW USERNAME-DIALOG DIRECTLY GIVE ACCESS TO THEIR CHATS!


                } else if (!emailListArr.includes(data.user.email)) {
                    // IF ACCOUNT DIDN'T MATCHED THEN CREATE A NEW ACCOUNT (THEN WILL HAVE TO SHOW USERNAME DIALOG ) 
                    setShowUsernameDialog(true) // showing username-dialog
                    setShowGoogleBtn(false) // google login in btn hidden
                }

            })
    }

    const checkUsernameAvail = (event) => {
        console.log(event.target.value)
        const list = [];
        if (event.target.value.length >= 6) {
            const colRef = collection(db, "users-ID");
            getDocs(colRef).then((snapshot) => {
                snapshot.docs.forEach(element => {
                    list.push(element.data().username);
                    if (list.includes(event.target.value) === true) {
                        setTimeout(() => {
                            setShowCross(true);
                            setShowTick(false);
                        }, 800);
                    } else if (list.includes(event.target.value) === false) {
                        setTimeout(() => {
                            setShowCross(false);
                            setShowTick(true);
                        }, 800);
                    }
                });
            })
        } else {
            setShowCross(false);
            setShowTick(false);
        }
    }

    // SIGN UP DETAILS
    const newUsernameFieldHandler = (event) => {
        setNewUsernameVal(allowedUsername(event.target.value))

        if (event.target.value.length >= 6) {
            // else do nothingS

        } else if (event.target.value.length < 6) {
            // setDisableGoogleBtn(true);
        }

    }

    useEffect(() => {
        setRandomBGImgVal(getRandomNumberGenerator())
    }, [])

    return (
        // randomBGImgVal
        <section className={`loginpage_section ${'backgroundImg-' + 1}`}>
            {randomBGImgVal === 2 && <img src={HUMAN_2} className="human human2" alt="" />}
            {randomBGImgVal === 3 && <img src={HUMAN_3} className="human human3" alt="" />}



            <div className="login_form">

                <div className='logo_span'>
                    <img src={LOGO} alt="palchat-logo" height="125px" />
                </div>

                <SIGNUP_FORM>
                    {showGoogleBtn && <Button
                        onClick={authUserHandler}
                        title="Enter username then you'll be able to sign in through google"
                        className='login_google_btn shineEff' variant='contained'>
                        <img src={GOOGLE_LOGO} alt="google_logo" height="30px" />

                        <span>
                            Login in with Google
                        </span>
                    </Button>}

                    {!showUsernameDialog && <USERNAME>
                        <AtIcon />
                        <INPUT
                            placeholder='username'
                            

                        />
                    </USERNAME>}
                </SIGNUP_FORM>


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
const USERNAME = STYLED.div`
display: flex;
justify-content:center;
background-color: #fff;
color: lightgray;
border-radius: 0.5rem;
padding: 0.5em 0.6em;
margin-bottom: 0.5em;
box-shadow: 3px 3px 5px #cbc8c85e;
width:90%;
`
const INPUT = STYLED.input`
  padding: 0.2em 0em;
  color: #232323b3;
  outline: none;
  font-size: 1em;
  border-radius: 0.5rem;
  text-decoration: none;
  border: none;
  width: 90%;

    input ::-ms-clear {
    display: none;
}

::placeholder {
  color: lightgray;
}`

export default LoginPage;