const functions = require('firebase-functions');


exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.countNumVisitors = functions.database.ref('/visitors').onWrite(event => {
  console.log(event);
  return event.data.ref.parent.child('count').set(event.data.numChildren());
});


exports.countNumEmployeesInLiveZone = functions.database.ref('/liveZones/{date}/{zonename}').onWrite(event => {
  console.log('write called');
  console.log(event);
  const collectionRef = event.data.ref.parent;
  console.log(collectionRef);
  const countRef = collectionRef.child('count');
  console.log(countRef);
  // return  countRef.transaction((current) => {
  //   return (current || 0) + 1;
  // }).then(() => {
  //   return console.log('Counter updated.');
  // });
})
