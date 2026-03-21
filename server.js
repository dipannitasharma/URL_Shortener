require('dotenv').config();
const express = require("express"); // import express
const bodyParser = require("body-parser");
const pool = require("./db");

const app = express(); // create app instance

const PORT = 3000; // define port

//middleware
app.use(bodyParser.json());

//function to create short code
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

// route
app.get("/", (req, res) => {
  res.send("URL Shortener is running");
});

app.post("/short", async (req, res) => {
  try {
    var { longurl } = req.body;
    if (!longurl) {
      return res.status(400).json({ error: "url is required" });
    }
    if (!longurl.startsWith("http://") || !longurl.startsWith("https://")) {
      longurl = "http://" + longurl;
    }

    const shortCode = generateShortCode();

    await pool.query("INSERT INTO urls (short_code, long_url) values ($1,$2)", [
      shortCode,
      longurl,
    ]);

    res.json({
      shorturl: `http://localhost:${PORT}/${shortCode}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM urls'
    )
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//redirect route
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    
    const result = await pool.query(
        'SELECT long_url from urls where short_code = $1',[code]
    );
    if(result.rows.length>0){
        return res.redirect(result.rows[0].long_url);
    }else{
        return res.status(404).send("URL not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
