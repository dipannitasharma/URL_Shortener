require('dotenv').config();
const express = require("express"); // import express
const bodyParser = require("body-parser");
const urlRoutes = require('./routes/urlRouutes');

const app = express(); // create app instance

const PORT = 3000; // define port

//middleware
app.use(bodyParser.json());


// route
app.use('/',urlRoutes);


app.get('/',(req,res)=>{
  res.send('Advanced URL Shortener Running');
})

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



