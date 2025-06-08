const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    res.status(200).send('Webhook received');
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Webhook listener running on port ${PORT}`);
});