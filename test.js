const getLastChar = (val) => {
    const strArr = val.split('')
    console.log(strArr[strArr.length - 1])
}

// test('himanshu');

const allowedUsername = (val) => {
    const regex = /[a-zA-Z0-9.\_]/gi
    console.log(val.match(regex).join('').toLowerCase())
}

allowedUsername('himANs!#hu_514')