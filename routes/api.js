const express = require('express');
let router = express.Router();

const mongoose = require('mongoose');
const mongodbUri = 'mongodb://localhost/notificationServer';
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const firebaseAdmin = require('firebase-admin');
const footballPredictionsKey = require('../credentials/football-predictions.json');
const epicPredictionsKey = require('../credentials/epic-predictions.json');
const coolPredictionsKey = require('../credentials/cool-predictions.json');

const footballPredictionsApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(footballPredictionsKey),
    databaseURL: "https://football-predictions-2487c.firebaseio.com"
}, 'footballPrediction');

const epicPredictionsApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(epicPredictionsKey),
    databaseURL: "https://epic-predictions.firebaseio.com"
}, 'epicPredictions');

const coolPredictionsApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(coolPredictionsKey),
    databaseURL: "https://cool-predictions.firebaseio.com"
}, 'coolPredictions');


mongoose.connect(mongodbUri, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) {
        console.log('Error in connecting to database: ', err);
    } else {
        console.log('Successfully connected to database: ', mongodbUri);
    }
});

router.post('/signup', (req, res) => {
    let userData = req.body;
    let user = new User(userData);
    console.log('new user: ',user);
    user.save((err) => {
        if (err) {
            console.log('Error in creating new user: ', err);
            res.json({ success: false, data: 'Something went wrong. Please try again.' });
        } else {
            console.log('New user created successfully: ', user);
            let payload = { subject: user._id };
            let token = jwt.sign(payload, 'SECRET');
            res.json({ success: true, data: token });
        }
    });
});

router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({ username: userData.username }, (err, user) => {
        if (err) {
            console.log('Error in finding user: ', err);
            res.json({ success: false, data: 'Something went wrong. Please try again.' });
        } else {
            if (user) {
                console.log('User found checking password');
                if (user.password === userData.password) {
                    console.log('User authenticated successfully');
                    let payload = { subject: user._id };
                    let token = jwt.sign(payload, 'SECRET');
                    res.json({ success: true, data: token });
                } else {
                    console.log('Invalid credentials');
                    res.json({ success: false, data: 'Invalid credentials' });
                }
            } else {
                console.log('user: ', userData.username + ' not found');
                res.json({ success: false, data: 'username not found' });
            }

        }
    });
});

router.post('/notify', verifyToken, (req, res) => {
    var message = {
        android: {
            priority: 'normal',
            notification: {
                title: req.body.title,
                body: req.body.message,
                sound:'default'
            },
        },
        topic: 'all'
    };

    if (req.body.app === 'footballPredictions') {
        footballPredictionsApp.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message to football predictions:', response);
                return res.json({ success: true, data: 'Successfully sent message to football predictions' });
            })
            .catch((error) => {
                console.log('Error sending message to football predictions:', error);
                return res.json({ success: false, data: 'Something went wrong while sending message to football predictions' });
            });
    } else if (req.body.app === 'epicPredictions') {
        epicPredictionsApp.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message to epic predictions:', response);
                return res.json({ success: true, data: 'Successfully sent message to epic predictions' });
            })
            .catch((error) => {
                console.log('Error sending message to epic predictions:', error);
                return res.json({ success: false, data: 'Error sending message to epic predictions' });
            });

    } else if (req.body.app === 'coolPredictions') {
        coolPredictionsApp.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message to cool predictions:', response);
                return res.json({ success: true, data: 'Successfully sent message to cool predictions' });
            })
            .catch((error) => {
                console.log('Error sending message to cool predictions:', error);
                return res.json({ success: false, data: 'Error sending message to cool predictions' });
            });
    }
});

function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorized Request');
        }

        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send('Unauthorized Request');
        }

        const payload = jwt.verify(token, 'SECRET');
        if (!payload) {
            return res.status(401).send('Unauthorized Request');
        }

        req.userId = payload.subject;
        next();
    } catch (error) {
        console.log('Error in verifying jwt: ', error.message);
        return res.status(401).send('Unauthorized Request');
    }

}
module.exports = router;