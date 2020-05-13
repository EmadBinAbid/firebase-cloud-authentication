const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

const firebase = require('firebase');
firebase.initializeApp(
    {
        apiKey: "AIzaSyAqNyfQCN0v7vgPoa4DpYFRALM3GUGC55Q",
        projectId: "eba-restaurant-finder",
        authDomain: "eba-restaurant-finder.firebaseapp.com",
        databaseURL: "https://eba-restaurant-finder.firebaseio.com",
        storageBucket: "eba-restaurant-finder.appspot.com",
        messagingSenderId: "840311466946"
    }
);

admin.initializeApp();


const db = admin.firestore();

var express = require('express');
const cors = require('cors');

var app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// firebase.auth().currentUser.uid

app.post('/getUser', (req, res) => {
    if (req.headers.authtoken) {
        admin.auth().verifyIdToken(req.headers.authtoken)
            .then(() => {
                db.collection('userDetails').where('uuid', '==', req.body.uuid).get()
                    .then(function (querySnapshot) {
                        let matchingUsers = [];

                        querySnapshot.forEach(function (doc) {
                            matchingUsers.push({
                                docId: doc.id,
                                data: doc.data()
                            })
                            res.json({
                                response: matchingUsers
                            });
                        });
                        return;
                    })
                    .catch(function (error) {
                        console.log('Error in retrieving users:', error);
                        res.json({
                            message: `Error in retrieving users:, ${error}`
                        });
                    });
                    return;
            }).catch(() => {
                res.status(403).send('Unauthorized')
            });
    } else {
        res.status(403).send('Unauthorized')
    }
});

app.get('/getAllUsers', (req, res) => {
    if (req.headers.authtoken) {
        admin.auth().verifyIdToken(req.headers.authtoken)
            .then(() => {
                db.collection('userDetails').get()
                    .then(function (querySnapshot) {
                        let allUsers = [];

                        querySnapshot.forEach(function (doc) {
                            allUsers.push({
                                docId: doc.id,
                                data: doc.data()
                            })
                            res.json({
                                response: allUsers
                            });
                        });
                        return;
                    })
                    .catch(function (error) {
                        console.log('Error in retrieving users:', error);
                        res.json({
                            message: `Error in retrieving users:, ${error}`
                        });
                    });
                    return;
            }).catch(() => {
                res.status(403).send('Unauthorized')
            });
    } else {
        res.status(403).send('Unauthorized')
    }
});

app.post('/register', (req, res) => {
    if (req.body.email && req.body.password && req.body.firstName && req.body.lastName) {
        admin.auth().createUser({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
            .then(function (userRecord) {
                db.collection('userDetails').add({
                    uuid: userRecord.uid,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                })
                    .then(function (docRef) {
                        console.log('Successfully created new user:', userRecord.uid);
                        res.json({
                            message: `Successfully created new user:, ${userRecord.uid}`
                        });
                        return;
                    })
                    .catch(function (error) {
                        console.log('Error creating new user:', error);
                        res.json({
                            message: `Error creating new user:, ${error}`
                        });
                    });
                return;
            })
            .catch(function (error) {
                console.log('Error creating new user:', error);
                res.json({
                    message: `Error creating new user:, ${error}`
                });
            });
    }
    else {
        res.json({
            message: "Error: The request payload must have email, password, firstName and lastName fields."
        });
    }
});

app.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {
        try {
            firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
                .then(function (userRecord) {
                    firebase.auth().currentUser.getIdToken(true)
                        .then(function (idToken) {
                            res.json({
                                message: 'Successfully signed in',
                                token: idToken
                            });
                            return;
                        })
                        .catch(function (error) {
                            console.log('Error while generating token:', error);
                        });
                    return;
                })
                .catch(function (error) {
                    console.log('Error while signing in:', error);
                    res.json({
                        message: `Error while signing in:, ${error}`
                    });
                });
        }
        catch (err) {
            res.json({
                error: err
            });
        }
    }
    else {
        res.json({
            message: "Error: The request payload must have email, password, firstName and lastName fields."
        });
    }
});

exports.api = functions.https.onRequest(app);