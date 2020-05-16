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

app.post('/getUser', (req, res) => {
    if (req.headers.authtoken) {
        if (req.body.uuid) {
            admin.auth().verifyIdToken(req.headers.authtoken)
                .then(() => {
                    db.collection('userDetails').where('uuid', '==', req.body.uuid).get()
                        .then(function (querySnapshot) {
                            res.json({
                                response: {
                                    docId: querySnapshot.docs[0].id,
                                    data: querySnapshot.docs[0].data()
                                }
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
        }
        else {
            res.json({
                message: "Error: The request payload must have a uuid field."
            });
        }
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

app.post('/addBookmark', (req, res) => {
    if (req.headers.authtoken) {
        console.log(req.body);
        if (req.body.uuid && req.body.type && req.body.website) {
            admin.auth().verifyIdToken(req.headers.authtoken)
                .then(() => {
                    db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                        .then(function (querySnapshot) {
                            if (querySnapshot.empty) {
                                if (req.body.type === 'liked') {
                                    db.collection('userBookmarks').add({
                                        uuid: req.body.uuid,
                                        likedWebsites: [req.body.website],
                                        newsWebsites: [],
                                        socialWebsites: [],
                                        weatherWebsites: []
                                    })
                                }
                                else if (req.body.type === 'news') {
                                    db.collection('userBookmarks').add({
                                        uuid: req.body.uuid,
                                        likedWebsites: [],
                                        newsWebsites: [req.body.website],
                                        socialWebsites: [],
                                        weatherWebsites: []
                                    })
                                }
                                else if (req.body.type === 'social') {
                                    db.collection('userBookmarks').add({
                                        uuid: req.body.uuid,
                                        likedWebsites: [],
                                        newsWebsites: [],
                                        socialWebsites: [req.body.website],
                                        weatherWebsites: []
                                    })
                                }
                                else if (req.body.type === 'weather') {
                                    db.collection('userBookmarks').add({
                                        uuid: req.body.uuid,
                                        likedWebsites: [],
                                        newsWebsites: [],
                                        socialWebsites: [],
                                        weatherWebsites: [req.body.website]
                                    })
                                }
                                else {
                                    res.json({
                                        message: 'Invalid value of field type'
                                    })
                                }
                            }
                            else {
                                let allWebsites = [];
                                if (req.body.type === 'liked') {
                                    querySnapshot.docs[0].data()["likedWebsites"].forEach(function (website) {
                                        allWebsites.push(website);
                                    });
                                    allWebsites.push(req.body.website);
                                    db.collection('userBookmarks').doc(querySnapshot.docs[0].id).update({
                                        likedWebsites: allWebsites
                                    });
                                }
                                else if (req.body.type === 'news') {
                                    querySnapshot.docs[0].data()["newsWebsites"].forEach(function (website) {
                                        allWebsites.push(website);
                                    });
                                    allWebsites.push(req.body.website);
                                    db.collection('userBookmarks').doc(querySnapshot.docs[0].id).update({
                                        newsWebsites: allWebsites
                                    });
                                }
                                else if (req.body.type === 'social') {
                                    querySnapshot.docs[0].data()["socialWebsites"].forEach(function (website) {
                                        allWebsites.push(website);
                                    });
                                    allWebsites.push(req.body.website);
                                    db.collection('userBookmarks').doc(querySnapshot.docs[0].id).update({
                                        socialWebsites: allWebsites
                                    });
                                }
                                else if (req.body.type === 'weather') {
                                    querySnapshot.docs[0].data()["weatherWebsites"].forEach(function (website) {
                                        allWebsites.push(website);
                                    });
                                    allWebsites.push(req.body.website);
                                    db.collection('userBookmarks').doc(querySnapshot.docs[0].id).update({
                                        weatherWebsites: allWebsites
                                    });
                                }
                                else {
                                    res.json({
                                        message: 'Error: Invalid value of field type'
                                    })
                                }
                            }

                            db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                                .then(function (querySnapshot) {
                                    if (querySnapshot.empty) {
                                        res.json({
                                            message: 'No relevant document found.'
                                        });
                                    }
                                    else {
                                        res.json({
                                            message: 'Successfully updated data',
                                            data: querySnapshot.docs[0].data()
                                        });
                                    }
                                    return;
                                })
                                .catch(function (error) {
                                    console.log('Error in updating user bookmarks:', error);
                                    res.json({
                                        message: `Error in updating user bookmarks:, ${error}`
                                    });
                                });
                            return;
                        })
                        .catch(function (error) {
                            console.log('Error in retrieving user bookmarks:', error);
                            res.json({
                                message: `Error in retrieving user bookmarks:, ${error}`
                            });
                        });
                    return;
                }).catch(() => {
                    res.status(403).send('Unauthorized')
                });
        }
        else {
            res.json({
                message: 'Error: The request payload must have uuid, type, and website fields.'
            });
        }
    } else {
        res.status(403).send('Unauthorized')
    }
});

app.post('/addLikedWebsite', (req, res) => {
    if (req.headers.authtoken) {
        if (req.body.uuid && req.body.likedWebsite) {
            admin.auth().verifyIdToken(req.headers.authtoken)
                .then(() => {
                    db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                        .then(function (querySnapshot) {
                            if (querySnapshot.empty) {
                                db.collection('userBookmarks').add({
                                    uuid: req.body.uuid,
                                    likedWebsites: [req.body.likedWebsite],
                                    newsWebsites: [],
                                    socialWebsites: [],
                                    weatherWebsites: []
                                })
                            }
                            else {
                                let allLikedWebsites = [];
                                querySnapshot.docs[0].data()["likedWebsites"].forEach(function (website) {
                                    allLikedWebsites.push(website);
                                });
                                allLikedWebsites.push(req.body.likedWebsite);
                                db.collection('userBookmarks').doc(querySnapshot.docs[0].id).update({
                                    likedWebsites: allLikedWebsites
                                });
                            }

                            db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                                .then(function (querySnapshot) {
                                    if (querySnapshot.empty) {
                                        res.json({
                                            message: 'No relevant document found.'
                                        });
                                    }
                                    else {
                                        res.json({
                                            message: 'Successfully updated data',
                                            data: querySnapshot.docs[0].data()
                                        });
                                    }
                                    return;
                                })
                                .catch(function (error) {
                                    console.log('Error in updating user bookmarks:', error);
                                    res.json({
                                        message: `Error in updating user bookmarks:, ${error}`
                                    });
                                });
                            return;
                        })
                        .catch(function (error) {
                            console.log('Error in retrieving user bookmarks:', error);
                            res.json({
                                message: `Error in retrieving user bookmarks:, ${error}`
                            });
                        });
                    return;
                }).catch(() => {
                    res.status(403).send('Unauthorized')
                });
        }
        else {
            res.json({
                message: "Error: The request payload must have uuid and likedWebsite fields."
            });
        }
    } else {
        res.status(403).send('Unauthorized')
    }
});

app.post('/addNewsWebsite', (req, res) => {
    if (req.headers.authtoken) {
        if (req.body.uuid && req.body.newsWebsite) {
            admin.auth().verifyIdToken(req.headers.authtoken)
                .then(() => {
                    db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                        .then(function (querySnapshot) {
                            if (querySnapshot.empty) {
                                db.collection('userBookmarks').add({
                                    uuid: req.body.uuid,
                                    likedWebsites: [],
                                    newsWebsites: [req.body.newsWebsite],
                                    socialWebsites: [],
                                    weatherWebsites: []
                                })
                            }
                            else {
                                let allNewsWebsites = [];
                                querySnapshot.docs[0].data()["newsWebsites"].forEach(function (website) {
                                    allNewsWebsites.push(website);
                                });
                                allNewsWebsites.push(req.body.newsWebsite);
                                db.collection('userBookmarks').doc(querySnapshot.docs[0].id).update({
                                    newsWebsites: allNewsWebsites
                                });
                            }

                            db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                                .then(function (querySnapshot) {
                                    if (querySnapshot.empty) {
                                        res.json({
                                            message: 'No relevant document found.'
                                        });
                                    }
                                    else {
                                        res.json({
                                            message: 'Successfully updated data',
                                            data: querySnapshot.docs[0].data()
                                        });
                                    }
                                    return;
                                })
                                .catch(function (error) {
                                    console.log('Error in updating user bookmarks:', error);
                                    res.json({
                                        message: `Error in updating user bookmarks:, ${error}`
                                    });
                                });
                            return;
                        })
                        .catch(function (error) {
                            console.log('Error in retrieving user bookmarks:', error);
                            res.json({
                                message: `Error in retrieving user bookmarks:, ${error}`
                            });
                        });
                    return;
                }).catch(() => {
                    res.status(403).send('Unauthorized')
                });
        }
        else {
            res.json({
                message: "Error: The request payload must have uuid and newsWebsite fields."
            });
        }
    } else {
        res.status(403).send('Unauthorized')
    }
});

app.post('/addSocialWebsite', (req, res) => {
    if (req.headers.authtoken) {
        if (req.body.uuid && req.body.socialWebsite) {
            admin.auth().verifyIdToken(req.headers.authtoken)
                .then(() => {
                    db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                        .then(function (querySnapshot) {
                            if (querySnapshot.empty) {
                                db.collection('userBookmarks').add({
                                    uuid: req.body.uuid,
                                    likedWebsites: [],
                                    newsWebsites: [],
                                    socialWebsites: [req.body.socialWebsite],
                                    weatherWebsites: []
                                })
                            }
                            else {
                                let allSocialWebsites = [];
                                querySnapshot.docs[0].data()["socialWebsites"].forEach(function (website) {
                                    allSocialWebsites.push(website);
                                });
                                allSocialWebsites.push(req.body.socialWebsite);
                                db.collection('userBookmarks').doc(querySnapshot.docs[0].id).update({
                                    socialWebsites: allSocialWebsites
                                });
                            }

                            db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                                .then(function (querySnapshot) {
                                    if (querySnapshot.empty) {
                                        res.json({
                                            message: 'No relevant document found.'
                                        });
                                    }
                                    else {
                                        res.json({
                                            message: 'Successfully updated data',
                                            data: querySnapshot.docs[0].data()
                                        });
                                    }
                                    return;
                                })
                                .catch(function (error) {
                                    console.log('Error in updating user bookmarks:', error);
                                    res.json({
                                        message: `Error in updating user bookmarks:, ${error}`
                                    });
                                });
                            return;
                        })
                        .catch(function (error) {
                            console.log('Error in retrieving user bookmarks:', error);
                            res.json({
                                message: `Error in retrieving user bookmarks:, ${error}`
                            });
                        });
                    return;
                }).catch(() => {
                    res.status(403).send('Unauthorized')
                });
        }
        else {
            res.json({
                message: "Error: The request payload must have uuid and socialWebsite fields."
            });
        }
    } else {
        res.status(403).send('Unauthorized')
    }
});

app.post('/addWeatherWebsite', (req, res) => {
    if (req.headers.authtoken) {
        if (req.body.uuid && req.body.weatherWebsite) {
            admin.auth().verifyIdToken(req.headers.authtoken)
                .then(() => {
                    db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                        .then(function (querySnapshot) {
                            if (querySnapshot.empty) {
                                db.collection('userBookmarks').add({
                                    uuid: req.body.uuid,
                                    likedWebsites: [],
                                    newsWebsites: [],
                                    socialWebsites: [],
                                    weatherWebsites: [req.body.weatherWebsite]
                                })
                            }
                            else {
                                let allWeatherWebsites = [];
                                querySnapshot.docs[0].data()["weatherWebsites"].forEach(function (website) {
                                    allWeatherWebsites.push(website);
                                });
                                allWeatherWebsites.push(req.body.weatherWebsite);
                                db.collection('userBookmarks').doc(querySnapshot.docs[0].id).update({
                                    weatherWebsites: allWeatherWebsites
                                });
                            }

                            db.collection('userBookmarks').where('uuid', '==', req.body.uuid).get()
                                .then(function (querySnapshot) {
                                    if (querySnapshot.empty) {
                                        res.json({
                                            message: 'No relevant document found.'
                                        });
                                    }
                                    else {
                                        res.json({
                                            message: 'Successfully updated data',
                                            data: querySnapshot.docs[0].data()
                                        });
                                    }
                                    return;
                                })
                                .catch(function (error) {
                                    console.log('Error in updating user bookmarks:', error);
                                    res.json({
                                        message: `Error in updating user bookmarks:, ${error}`
                                    });
                                });
                            return;
                        })
                        .catch(function (error) {
                            console.log('Error in retrieving user bookmarks:', error);
                            res.json({
                                message: `Error in retrieving user bookmarks:, ${error}`
                            });
                        });
                    return;
                }).catch(() => {
                    res.status(403).send('Unauthorized')
                });
        }
        else {
            res.json({
                message: "Error: The request payload must have uuid and weatherWebsite fields."
            });
        }
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
            message: "Error: The request payload must have email and password fields."
        });
    }
});

exports.api = functions.https.onRequest(app);