const pool = require('../db');

function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

exports.shortenUrl = async (req, res) => {
    try {
        let { longUrl, customCode } = req.body;

        if (!longUrl) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
            longUrl = 'http://' + longUrl;
        }

        const BASE_URL = process.env.BASE_URL || `http://localhost:3000`;

        let shortCode = customCode || generateShortCode();

        // check duplicate long URL
        const duplicate = await pool.query(
            'SELECT short_code FROM urls WHERE long_url = $1',
            [longUrl]
        );

        if (duplicate.rows.length > 0) {
            return res.json({
                shortUrl: `${BASE_URL}/${duplicate.rows[0].short_code}`,
                message: "URL already shortened"
            });
        }

        await pool.query(
            'INSERT INTO urls (short_code, long_url) VALUES ($1, $2)',
            [shortCode, longUrl]
        );

        res.json({
            shortUrl: `${BASE_URL}/${shortCode}`
        });

     } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Short code already exists' });
        }
        console.error(err);
        res.status(500).send('Server error');
    }
  
};

// redirect
exports.redirectUrl = async (req, res) => {
    try {
        const { code } = req.params;

        const result = await pool.query(
            'SELECT long_url FROM urls WHERE short_code = $1',
            [code]
        );

        if (result.rows.length > 0) {

            // increment clicks
            await pool.query(
                'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1',
                [code]
            );

            return res.redirect(result.rows[0].long_url);
        } else {
            return res.status(404).send('URL not found');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getStats = async (req, res) => {
    try {
        const { code } = req.params;

        const result = await pool.query(
            'SELECT short_code, long_url, clicks, created_at FROM urls WHERE short_code = $1',
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};