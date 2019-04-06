const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userAuthLogsSchema = new Schema({
    
    username: String,
    action: String,
    request_signature: {
        user_agent: String,
        ip_address: String,
        browser_cookies: String
    },
    tx_final_status: String,
    message: String
},
{
  timestamps: true
});

module.exports = mongoose.model('UserAuthLogs',userAuthLogsSchema);