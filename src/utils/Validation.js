import React from 'react';

export function passwordValidation (passwordInputValue) {
    const uppercaseRegExp   = /(?=.*?[A-Z])/;
    const lowercaseRegExp   = /(?=.*?[a-z])/;
    const digitsRegExp      = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp   = /.{8,}/;

    const passwordLength =      passwordInputValue.length;
    const uppercasePassword =   uppercaseRegExp.test(passwordInputValue);
    const lowercasePassword =   lowercaseRegExp.test(passwordInputValue);
    const digitsPassword =      digitsRegExp.test(passwordInputValue);
    const specialCharPassword = specialCharRegExp.test(passwordInputValue);
    const minLengthPassword =   minLengthRegExp.test(passwordInputValue);

    let errMsg ="";
    if(passwordLength===0){
            errMsg="Password is empty";
    }else if(!uppercasePassword){
            errMsg="At least one Uppercase";
    }else if(!lowercasePassword){
            errMsg="At least one Lowercase";
    }else if(!digitsPassword){
            errMsg="At least one digit";
    }else if(!specialCharPassword){
            errMsg="At least one Special Characters";
    }else if(!minLengthPassword){
            errMsg="At least minumum 8 characters";
    }else{
        errMsg="";
    }   
    
    return errMsg;
}

export  function comparePassword(password1, password2){
    let errMsg ="";
    if(password1 == password2){
        errMsg="";
    }
    else{
        errMsg="passwords doesn't Match"
    }
    return errMsg;
}

export function NICvalidation(nicNumber) {
    var result = "";
    if (nicNumber.length === 10 && !isNaN(nicNumber.substr(0, 9)) && isNaN(nicNumber.substr(9, 1).toLowerCase()) && ['x', 'v'].includes(nicNumber.substr(9, 1).toLowerCase())) {
        result = "";
    } else if (nicNumber.length === 12 && !isNaN(nicNumber)) {
        result = "";
    } else {
        result = "NIC Number Is Wrong";
    }
    return result;
}

export function PhoneNoValidation(phoneNumber) {
    var regexPhoneNumber = /(^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$)/
    const validPhoneNumber =   regexPhoneNumber.test(phoneNumber);

    let errMsg ="";
    if(!validPhoneNumber){
            errMsg="Not a valid phone number";
    }
    return errMsg;
}

