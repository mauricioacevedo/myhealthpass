const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
    lockout: String,
    request_signature: {
        user_agent: String,
        ip_address: String,
        browser_cookies: String
    }
    , lockout_date_end: Date
},
{
  timestamps: true
});


module.exports = mongoose.model('SystemLockout',userSchema);