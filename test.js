const myList = ["gabbat514@gmail.com", "hs8ytc@gmail.com", "himanshu001pal@gmail.com", "himanshu01.dev@gmail.com", "iamsyd.dev@gmail.com"];

// myList.includes("gabbat514@gmail");

myObj = {
    data: {
        user: {
            value: "@gmail"
        }
    }
}

const authUserHandler = () => {
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

// console.log(myObj.data.user.value)

if (myList.includes(myObj.data.user.value)) {
    console.log('Acc already exits!')
}

