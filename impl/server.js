const express = require("express");
var cors = require('cors')
const app = express();
app.use(cors())
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(require('./routes/index'))

app.listen(40001,()=>{
    console.log('[INFO]Listening on port 40001');
})

