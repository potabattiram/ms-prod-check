const express = require('express');
const axios = require('axios');
const path = require('path');
const microservice_urls = require('./ms_urls');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const app = express();
const port = 9000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/prod-status', async (req, res) => {
    let results = [];

    for (let url of microservice_urls) {
        try {
            const response = await axios.get(url);
            if (response.status === 200 && response.data.STATUS) {
                results.push({ url: url, status: 'green', message: response.data.STATUS });
            } else {
                results.push({ url: url, status: 'red', message: 'Unexpected response' });
            }
        } catch (error) {
            results.push({ url: url, status: 'red', message: error.message });
        }
    }

    res.render('status', { results });
});


app.listen(port, () => {
    console.log(`API status checker listening at http://localhost:${port}`);
});
