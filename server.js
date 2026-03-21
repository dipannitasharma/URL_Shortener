const express = require('express'); // import express
const bodyParser = require('body-parser')

const app = express(); // create app instance

const PORT = 3000; // define port

//middleware
app.use(bodyParser.json());

//temp database
const urlDatabase = {};

//function to create short code
function generateShortCode(){
    return Math.random().toString(36).substring(2,8);
}

// route
app.get('/', (req, res) => {
    res.send('URL Shortener is running');
});

app.post('/short',(req,res)=>{
    var {longurl} = req.body;
    if(!longurl){
        return res.status(400).json({error:'url is required'});
    }
    if(!longurl.startsWith('http://') || !longurl.startsWith('https://')){
        longurl = 'http://' + longurl;
    }
    
    const shortCode = generateShortCode();

    urlDatabase[shortCode] = longurl;

    res.json({
        shorturl : `http://localhost:${PORT}/${shortCode}`
    })
});

app.get('/all',(req,res)=>{
    res.json(urlDatabase)
})

//redirect route
app.get('/:code',(req,res)=>{
    const {code} = req.params;
    const longurl = urlDatabase[code];

    if(longurl){
        return res.redirect(longurl);
    }else{
        return res.status(404).send('Url not found');
    }
});


// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});