const express = require('express')
const app = express()
const dotenv = require('dotenv').config();
require('express-async-errors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const emailRoutes = require('./routes/valiEmailRoutes');
const questionRoutes  = require('./routes/questionRoutes');


connectDB();
app.use(express.json());



app.get('/', (req, res) =>{
    res.status(200).send('hello hi khana khake jana ');
})

app.use('/email' , emailRoutes);
app.use('/domain',questionRoutes);


const port = process.env.PORT || 5000;
app.listen(port,  () =>{
    console.log(`Server running on port ${port}`)
})

