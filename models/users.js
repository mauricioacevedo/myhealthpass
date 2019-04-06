const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: String,
    status: String
},
{
  timestamps: true
});

userSchema.methods.toJSON = function () {
    let userObject = this.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model('User',userSchema);