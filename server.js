const express = require('express'); // import express

const app = express(); // create app instance

const PORT = 3000; // define port

// route
app.get('/', (req, res) => {
    res.send('server is running');
});
app.get('/name',(req,res)=>{
    res.send("dipannnita")
})

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});