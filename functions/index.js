/* eslint-disable prettier/prettier */
const functions = require('firebase-functions');
const fetch = require('node-fetch');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');

const serviceAccount = require('./vestavind-4105a90ed990.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Cloud Firestore under the path /messages/:documentId/original

exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
  console.log('This will be run every 1 minutes!');
  const FieldValue = admin.firestore.FieldValue;

  const windspeed = fetch('https://vindafor.azurewebsites.net/api/Weather').then((result) => result.json());

  const powerprice = fetch('https://vindafor.azurewebsites.net/api/PowerPrice').then((result) => result.json());

  let myheaders = {
    GroupId: 'svg',
    GroupKey: 'ZW43OAUPlEKuqfMETg0izA==',
  };

  const activeWindmills = fetch('https://vindafor.azurewebsites.net/api/Windmills', {
    method: 'GET',

    headers: myheaders,
  }).then((response) => response.json());

  return Promise.all([windspeed, powerprice, activeWindmills]).then((data) => {
    const [windspeed, powerprice, activeWindmills] = data;
    return db
      .collection('log')
      .add({ windspeed, powerprice, activeWindmills, timestamp: FieldValue.serverTimestamp() });
  });
});
