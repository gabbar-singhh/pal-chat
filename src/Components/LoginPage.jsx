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
import HUMAN_2 from '../Assets/human_3d/2.png'
import HUMAN_3 from '../Assets/human_3d/3.png'
import Snackbar from './BaiscComponents/Snackbar';

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
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarVal, setSnackbarVal] = useState({ type: "success", mssg: "", autoHideDuration: 2000 });
    const [userdata, setUserdata] = useState({});

    const authUserHandler = () => {
        console.log("🔐")
        const emailListArr = [];

        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then((data) => {

                // ADDING ACCOUNT-DATA TO VARIABLE FOR LATER USE

                setUserdata({ data: data })

                //FULL DETAILS ABOUT USERS 
                const userProfileColsRef = collection(db, 'users-Profile');

                //ONLY USERNAME AND EMAIL-ID 
                const colRef = collection(db, "users-ID");
                getDocs(colRef).then((snapshot) => {
                    snapshot.docs.forEach(element => {
                        // console.log(element.data().email_id);
                        emailListArr.push(element.data().email_id)
                    });
                })
                console.log(CHALK.cyan("-getDocs ✔"))

                console.log(emailListArr)

                console.log(CHALK.cyan("-checking emailID ✔"))

                if (emailListArr.includes(data.user.email)) {
                    console.log(CHALK.red("Account already exists!"))

                    //ACCOUNT ALREADY EXISTS, SO NO NEED TO SHOW USERNAME-DIALOG DIRECTLY GIVE ACCESS TO THEIR CHATS!
                    console.log(CHALK.cyan("-Account Found ✔"))
                    setSnackbarOpen(true);
                    setSnackbarVal({ type: "success", mssg: "Account already exists! signing in...", autoHideDuration: 3000 });
                    console.log(CHALK.cyan("-Signed In ✔"))



                } else if (!emailListArr.includes(data.user.email)) {
                    // IF ACCOUNT DIDN'T MATCHED THEN CREATE A NEW ACCOUNT (THEN WILL HAVE TO SHOW USERNAME DIALOG ) 
                    console.log(CHALK.cyan("-creating an account ✔"))
                    setSnackbarOpen(true);
                    setSnackbarVal({ type: "info", mssg: "Account didn't exist! Creating an Account...", autoHideDuration: 6000 });
                    setShowUsernameDialog(true) // showing username-dialog
                    setShowGoogleBtn(false) // google login in btn hidden
                }

            })
    }

    const submitBtnHandler = (event) => {
        const userProfileColsRef = collection(db, 'users-Profile');

        const usernameList = [];
        if (newUsernameVal.length >= 6) {
            //ONLY USERNAME AND EMAIL-ID 
            const colRef = collection(db, "users-ID");

            getDocs(colRef).then((snapshot) => {
                snapshot.docs.forEach(element => {
                    console.log('🎂', element);
                    usernameList.push(element.data().username);
                })
            });
                console.log('😮‍💨',event.target.value)
            if (usernameList.includes(event.target.value)) {
                console.log(CHALK.cyan("-username already exists, select another ✔"))
                setNewUsernameVal("")
                setSnackbarOpen(true);
                setSnackbarVal({ type: "error", mssg: "Username already taken!", autoHideDuration: 1000 });
            } else if (!usernameList.includes(event.target.value)) {
                // CREATE THE ACCOUNT WITH THE PROVIDED USERNAME! 
                console.log(CHALK.green("-Account Creating Process...✔"))

                console.log('🤢', userdata.data._tokenResponse.email)

                addDoc(userProfileColsRef, {

                    "display_name": userdata.data.user.displayName,
                    "email_id": userdata.data._tokenResponse.email,
                    "isEmailVerified": userdata.data._tokenResponse.emailVerified,
                    "first_name": userdata.data._tokenResponse.firstName,
                    "last_name": userdata.data._tokenResponse.lastName,
                    "full_name": userdata.data._tokenResponse.fullName,
                    "photoURL": userdata.data._tokenResponse.photoUrl,
                    "creation_time": userdata.data.user.metadata.creationTime,
                    "browser_name": userdata.data.user.auth.config.sdkClientVersion,
                    "username": newUsernameVal

                }).then(() => {
                    addDoc(colRef, {
                        "email_id": userdata.data._tokenResponse.email,
                        "username": newUsernameVal
                    })
                })


                console.log('Done');
                // LOGIN PAGE COMPLETED !!
            }

        } else {
            setSnackbarOpen(true);
            setSnackbarVal({ type: "error", mssg: "Username should be atleast 6 letter long.", autoHideDuration: 3000 });
        }
    }


    const usernameInputHandler = (event) => {
        setNewUsernameVal(allowedUsername(event.target.value))
    }

    useEffect(() => {
        // setRandomBGImgVal(getRandomNumberGenerator())
    }, [])

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={snackbarVal.autoHideDuration}
                type={snackbarVal.type}
                message={snackbarVal.mssg}
                onClose={() => { setSnackbarOpen(false) }}
            />

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

                        {showUsernameDialog &&
                            <>
                                <USERNAME>
                                    <AtIcon />
                                    <INPUT
                                        value={newUsernameVal}
                                        onChange={usernameInputHandler}
                                        type="search"
                                        spellCheck="false"
                                        title="Username must only contain alphabets, underscore or periods"
                                        placeholder='username'
                                    />
                                </USERNAME>
                                <Button
                                    className="submitBtn shineEff"
                                    onClick={submitBtnHandler}
                                >Submit</Button>
                            </>
                        }
                    </SIGNUP_FORM>


                </div>
            </section >
        </>)
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
padding: 0.5em 1em;
margin-bottom: 0.5em;
box-shadow: 3px 3px 5px #cbc8c85e;
width: 20vw;
`
const INPUT = STYLED.input`
  padding: 0.2em 0.5em;
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