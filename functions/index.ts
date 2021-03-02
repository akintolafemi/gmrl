function validateEmail(email: string) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(pw) {
    let re = /[A-Za-z]/;
    let num = /[0-9]/;			//alphabeths and numbers alone
    //[A-Z]/ uppercase alone
    //	/[a-z]/ lowercase only
    // /[0-9]/ numbers only
    // /[^A-Za-z0-9]/ special characters only
    return re.test(pw) && num.test(pw) && pw.length > 7;
}

function validatePhone(phone) {
    let re = /[0-9]/;
    return re.test(phone) && phone.length > 8;
}

export default {
  validateEmail,
  validatePassword,
  validatePhone,
}
