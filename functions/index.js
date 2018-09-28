const functions = require('firebase-functions');

const nodemailer = require('nodemailer');
const PdfDocument = require('pdfkit');
var PdfTable = require('voilab-pdf-table');


const PROJECT_ID = "idmanagement-14104";
var config = {
    projectId: `${PROJECT_ID}`,
    keyFilename: './idmanagement-14104-firebase-adminsdk-36s02-61791933e1.json'
};
// const {Storage} = require('@google-cloud/storage');
// const storage = new Storage({
//   projectId: PROJECT_ID,
// });

// The name for the new bucket
// const bucketName = 'my-new-bucket';

// Creates the new bucket
// storage
//   .createBucket(bucketName)
//   .then(() => {
//     console.log(`Bucket ${bucketName} created.`);
//   })
//   .catch(err => {
//     console.error('ERROR:', err);
//   });

const admin = require('firebase-admin');
var serviceAccount = require("./idmanagement-14104-firebase-adminsdk-36s02-61791933e1.json");


const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport( `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://idmanagement-14104.firebaseio.com",
  storageBucket: "idmanagement-14104.appspot.com"

});




const APP_NAME = 'My App';


exports.addMessage = functions.https.onRequest((req, res) => {
// [END addMessageTrigger]
  // Grab the text parameter.
  const original = req.query.text;
  // [START adminSdkPush]
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
  // [END adminSdkPush]
});


exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });

    exports.generateReport = functions.https.onRequest((req, res) => {
    // [END addMessageTrigger]
      // Grab the text parameter.
      const original = req.query.text;
      // [START adminSdkPush]
      // Push the new message into the Realtime Database using the Firebase Admin SDK.
      return admin.database().ref('/reports/weekly').push({value: true}).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.redirect(303, snapshot.ref.toString());
      });
      // [END adminSdkPush]
    });

    // exports.compute = functions.database.ref('/reports/weekly')
    //     .onWrite((snapshot, context) => {
    //       // Grab the current value of what was written to the Realtime Database.
    //        admin.database().ref('/attendance/dates/01-08-2018').once('value').then((snapshot) => {
    //             console.log('@@@@@@', snapshot.val());
    //             return snapshot.val();
    //       });
    //
    //     });




  exports.sendReportInPDF = functions.database.ref('/reports/weekly').onWrite((snapshot, context) => {
        // [END onCreateTrigger]

        let datesArr=[]; let allDatesResponseObj = {};
        datesArr.push("18-09-2018", "19-09-2018");
        Promise.all(
          datesArr.map((date) => {
            return admin.database().ref('/attendance/dates/').child(date).once('value').then((snapshot) => {
              console.log('data = = = ', snapshot.val())
              allDatesResponseObj[date] = snapshot.val();
          })
        })).then(() => {
          console.log('all attendance data', allDatesResponseObj);
          let pdfData = ''

          var pdf = new PdfDocument({
                         autoFirstPage: false
                     }),
                     table = new PdfTable(pdf, {
                         bottomMargin: 30
                     });
//                             const user = 'this is data'; // The Firebase user.
//           const email = 'rrakesh100@gmail.com'; // The email of the user.
//           const displayName = 'Rakesh Rampalli'; // The display name of the user.
//           // [END eventAttributes]
//           console.log('storage X X X ',admin.storage());
//           const bucket = admin.storage().bucket();
//           console.log('bucket = = = ' ,  bucket);
//           const filename =  'output.pdf';
//           const file = bucket.file(filename);
//           const stream = file.createWriteStream({resumable: false});
//
//           console.log('doc = = =', doc);
//          // Pipe its output to the bucket
//           doc.pipe(stream);
//           doc.fontSize(25).text('Some text with an embedded font!', 100, 100);
//           doc.moveDown();
//           doc.fontSize(25).text(pdfData, 100, 100);
//           const table0 = {
//     headers: ['Word', 'Comment', 'Summary'],
//     rows: [
//         ['Apple', 'Not this one', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.'],
//         ['Tire', 'Smells like funny', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.']
//     ]
// };
//
// doc.table(table0, {
//     prepareHeader: () => doc.font('Helvetica-Bold'),
//     prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
// });
//
// const table1 = {
//     headers: ['Country', 'Conversion rate', 'Trend'],
//     rows: [
//         ['Switzerland', '12%', '+1.12%'],
//         ['France', '67%', '-0.98%'],
//         ['England', '33%', '+4.44%']
//     ]
// };
//
// doc.moveDown().table(table1, 100, 350, { width: 300 });
//
//
//           doc.end();
//           stream.on('finish', function () {
//                 return mailIt(email, displayName, doc);
//           });
//
//           stream.on('error', function(err) {
//                console.log(err);
//           });


  table.addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
              column: 'name'
          }))
          // set defaults to your columns
          .setColumnsDefaults({
              headerBorder: 'B',
              align: 'right'
          })
          // add table columns
          .addColumns([
            {
                id: 'empId',
                header: 'Employee ID',
                align: 'left',
                width: 50
            },  {
                  id: 'name',
                  header: 'Name',
                  align: 'left'
              },
              {
                  id: 'date',
                  header: 'Date',
                  align: 'left',
                    width: 80
              },
              {
                  id: 'inTime',
                  header: 'In Time',
                  width: 60
              },
              {
                  id: 'outTime',
                  header: 'Out Time',
                  width: 60
              }
          ])
          // add events (here, we draw headers on each new page)
          .onPageAdded(function (tb) {
              tb.addHeader();
          });

      // if no page already exists in your PDF, do not forget to add one
      pdf.addPage();

      // draw content, by passing data to the addBody method
      let body = [];
      let employeeVsDate = {};
      Object.keys(allDatesResponseObj).map((date,index) => {
          let attObj = allDatesResponseObj[date];
          Object.keys(attObj).map((empId, k) => {
            let existingData  = employeeVsDate[empId] || [];
            let newData = {
              [date] :  attObj[empId]
            }
            existingData.push(newData);
            employeeVsDate[empId] = existingData;
          })
      })
    //  console.log('employeeVsDate = = ', employeeVsDate);
      Object.keys(employeeVsDate).forEach((employeeId) => {
        let employeeDataForAllDates = employeeVsDate[employeeId];
        employeeDataForAllDates.map(dateVsData => {
          Object.keys(dateVsData).map(date => {
          //  console.log('employeeDataForAllDates[date] = = = ', dateVsData[date]);
            if(!employeeId) {
              console.log('@@@@@@ empId is undefined = = = ', employeeId);
            }
            if(!date) {
              console.log('@@@@@@ date is undefined = = = ', date);
            }
            if(!dateVsData[date]['out'] ) {
              console.log('OOOOOOO name is undefined = = = ', dateVsData[date]['out']);
            }
            if(!dateVsData[date]['in'] ) {
              console.log('IIIIIIII in is undefined = = = ', dateVsData[date]['in']);
            }
            if(!dateVsData[date]['name'] ) {
              console.log('###### name is undefined = = = ', dateVsData[date]['name']);
            }

            if(dateVsData[date]) {
              body.push({
                empId: employeeId || 'No ID',
                name : dateVsData[date]['name'] || 'No Name',
                date : date || 'No Date',
                inTime : dateVsData[date]['in'] || 'N/A',
                outTime : dateVsData[date]['out']|| 'N/A'

              })
            //  console.log('body temporarily = = = ', body);
            }
          })
        });
      });

      console.log('body = = = ', body);
      table.addBody(body);

                const user = 'this is data'; // The Firebase user.
                const email = 'rrakesh100@gmail.com'; // The email of the user.
                const displayName = 'Rakesh Rampalli'; // The display name of the user.
                // [END eventAttributes]
                console.log('storage X X X ',admin.storage());
                const bucket = admin.storage().bucket();
                console.log('bucket = = = ' ,  bucket);
                const filename =  new Date().getTime() + '.pdf';
                const file = bucket.file(filename);
                const stream = file.createWriteStream({resumable: false});
                console.log('filename = = =', filename);


                console.log('doc = = =', pdf);
               // Pipe its output to the bucket
                pdf.pipe(stream);

                          pdf.end();
                          stream.on('finish', function () {
                                return mailIt(email, displayName, pdf);
                          });

        })

      });


        // Sends a welcome email to the given user.
          function mailIt(email, displayName, doc) {
              const mailOptions = {
                  from: '"MyCompany" <noreply@firebase.com>',
                  to: email,
              };

              mailOptions.subject = `Welcome to ${APP_NAME}!`;
              mailOptions.text = `Hey ${displayName}!, Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
              mailOptions.attachments =  [{filename: 'my.pdf', content: doc, contentType: 'application/pdf'  }];

              return mailTransport.sendMail(mailOptions).then(() => {
                  console.log('New welcome email sent to:', email);
              });
          }
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//
//
// exports.countNumVisitors = functions.database.ref('/visitors').onWrite(event => {
//   console.log(event);
//   return event.data.ref.parent.child('count').set(event.data.numChildren());
// });
//
//
// exports.countNumEmployeesInLiveZone = functions.database.ref('/liveZones/{date}/{zonename}').onWrite(event => {
//   console.log('write called');
//   console.log(event);
//   const collectionRef = event.data.ref.parent;
//   console.log(collectionRef);
//   const countRef = collectionRef.child('count');
//   console.log(countRef);
//   // return  countRef.transaction((current) => {
//   //   return (current || 0) + 1;
//   // }).then(() => {
//   //   return console.log('Counter updated.');
//   // });
// })
