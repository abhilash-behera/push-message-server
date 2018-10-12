/*jslint es6 */
const express = require('express');
const bodyParser = require('body-parser');
const PORT = 80;

const app = express();
const api = require('./routes/api');

app.use(bodyParser.json());
app.use('/api', api);
app.use(express.static(__dirname + '/dist/push-message-server'));

app.get('/*', (req, res) => {
    res.sendFile(__dirname+'/dist/push-message-server/index.html');
});

app.listen(PORT, (err) => {
    if (err) {
        console.log('Error in starting server: ', err);
    } else {
        console.log('Server started successfully on port: ', PORT);
    }
});