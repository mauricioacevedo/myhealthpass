/***************************************************************
 ******************** MIDDLEWARE CONFIG FILE *******************
 *************************************************************** 
 ***************************************************************/

/********************** DATABASE CONFIG ************************/

process.env.URLDB=process.env.URLDB||'mongodb://localhost:27017/myhealthpassdb';
        

/*************** PASSWORD COMPLEXITY POLICIES *******************/

// set required minimum password length otherwise you could set to DISABLED 
// (careful THERE: the DISABLE option let pass any length password)
process.env.PASSWORD_LENGTH=process.env.PASSWORD_LENGTH||8

// check for password mixed case otherwise you could set to DISABLE 
// (careful THERE: the DISABLED option let pass passwords with any case)
process.env.PASSWORD_MIXED_CASE=process.env.PASSWORD_MIXED_CASE||"ENABLED"

//password must have at least one special character, you could set to DISABLED 
// the DISABLED option wont let any password with special characters pass
//
process.env.PASSWORD_SPECIAL_CHARACTERS=process.env.PASSWORD_SPECIAL_CHARACTERS||"ENABLED"
process.env.PASSWORD_SPECIAL_CHARACTERS_VALID_OPTIONS=process.env.PASSWORD_SPECIAL_CHARACTERS_VALID_OPTIONS||"!@#$%&*";
process.env.PASSWORD_SPECIAL_CHARACTERS_INVALID_OPTIONS=process.env.PASSWORD_SPECIAL_CHARACTERS_INVALID_OPTIONS||"(){}/?^\\-_'\"|";

//password must have numbers
process.env.PASSWORD_NUMBERS=process.env.PASSWORD_NUMBERS||"ENABLED";

// Registration required fields for user
process.env.NEW_USER_REQUIRED_FIELDS=process.env.NEW_USER_REQUIRED_FIELDS||['name','username','password','role'];

/******************************************************************************
 *************************** TOKEN EXPIRATION *********************************/
//token expiration time
process.env.TOKEN_EXPIRES =process.env.TOKEN_EXPIRES || "10m";

// seed
process.env.SEED_AUTH =process.env.SEED_AUTH|| 'seed-whatever-you-need';

/******************************************************************************
 *************************** SECURITY OPTIONS *********************************/

/*SECURITY_MODE:
* - ENFORCE: check all the transactions to find possible attacks and control login.
* - DISABLED: let pass all the traffic with no control.
*/
process.env.SECURITY_MODE=process.env.SECURITY_MODE||"ENFORCE"

//the number of failed logins to lockout a request_signature
process.env.LOCKOUT_TRESSHOLD=process.env.LOCKOUT_TRESSHOLD||"13"

//time (IN MINUTES) to look up for errors in database
process.env.LOCKOUT_TIME=process.env.LOCKOUT_TIME||"10"

//time(IN MINUTES) to lockout a request_signature
process.env.LOCKOUT_DURATION=process.env.LOCKOUT_DURATION||"20"


