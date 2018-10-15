// const functions = require('firebase-functions');
//
// const nodemailer = require('nodemailer');
// const PdfDocument = require('pdfkit');
// var PdfTable = require('voilab-pdf-table');
// require('events').EventEmitter.prototype._maxListeners = 1000;
// var request = require('request');
// var path = require("path");
// const imageDownloader = require('images-downloader')
//
//
// const PROJECT_ID = "learning-111";
// var config = {
//     projectId: `${PROJECT_ID}`,
//     keyFilename: './key.json'
// };
//
// //Environment configuration is made available inside your running function via functions.config()
//
// // firebase functions:config:set
//
// // firebase functions:config:set gmail.email=rrakesh100@gmail.com
// //firebase functions:config:set gmail.password=rrakesh100@gmail.com
//
// // const {Storage} = require('@google-cloud/storage');
// // const storage = new Storage({
// //   projectId: PROJECT_ID,
// // });
//
// // The name for the new bucket
// // const bucketName = 'my-new-bucket';
//
// // Creates the new bucket
// // storage
// //   .createBucket(bucketName)
// //   .then(() => {
// //     console.log(`Bucket ${bucketName} created.`);
// //   })
// //   .catch(err => {
// //     console.error('ERROR:', err);
// //   });
//
//
//
//
// const admin = require('firebase-admin');
// var serviceAccount = require("./key.json");
//
//
// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;
// const mailTransport = nodemailer.createTransport( `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);
//
//
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://learning-111.firebaseio.com/",
//   storageBucket: "learning-111.appspot.com"
//
// });
//
//
//
//
// const APP_NAME = 'My App';
//
//
// exports.generateReport = functions.https.onRequest((req, res) => {
// // [END addMessageTrigger]
//   // Grab the text parameter.
//   const original = req.query.text;
//   // [START adminSdkPush]
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   return admin.database().ref('/reports/weekly').push({value: true}).then((snapshot) => {
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     return res.redirect(303, snapshot.ref.toString());
//   });
//   // [END adminSdkPush]
// });
//
//     // exports.compute = functions.database.ref('/reports/weekly')
//     //     .onWrite((snapshot, context) => {
//     //       // Grab the current value of what was written to the Realtime Database.
//     //        admin.database().ref('/attendance/dates/01-08-2018').once('value').then((snapshot) => {
//     //             console.log('@@@@@@', snapshot.val());
//     //             return snapshot.val();
//     //       });
//     //
//     //     });
//
//
//
//
// exports.sendReportInPDF = functions.database.ref('/reports/weekly').onWrite((snapshot, context) => {
//     // [END onCreateTrigger]
//     console.log('Function invoked');
//
//     let datesArr=[]; let allDatesResponseObj = {};
//     admin.database().ref('/employees').once('value').then((employeeData) => {
//       let employeesMetadata = employeeData.val();
//       datesArr.push("18-09-2018","19-09-2018","20-09-2018", "21-09-2018", "22-09-2018", "23-09-2018");
//        Promise.all(
//         datesArr.map((date) => {
//           return admin.database().ref('/attendance/dates/').child(date).once('value').then((snapshot) => {
//             allDatesResponseObj[date] = snapshot.val();
//         })
//       })).then(() => {
//       //  console.log('all attendance data', allDatesResponseObj);
//         let i = 0;
//         // draw content, by passing data to the addBody method
//         let employeeVsDate = {}; var tablesArray = [];
//         Object.keys(allDatesResponseObj).map((date,index) => {
//             let attObj = allDatesResponseObj[date];
//             Object.keys(attObj).map((empId, k) => {
//               let existingData  = employeeVsDate[empId] || [];
//               let newData = {
//                 [date] :  attObj[empId]
//               }
//               existingData.push(newData);
//               employeeVsDate[empId] = existingData;
//             })
//         })
//
//         const user = 'this is data'; // The Firebase user.
//         const email = 'rrakesh100@gmail.com'; // The email of the user.
//         const displayName = 'Rakesh Rampalli'; // The display name of the user.
//         // [END eventAttributes]
//
//
//         var pdf = new PdfDocument({ autoFirstPage: false });
//
//         Object.keys(employeeVsDate).forEach((employeeId) => {
//           if(i>10) {
//             return;
//           }
//           pdf.addPage();
//           var table = new PdfTable(pdf, { bottomMargin: 30, topMargin : 30 });
//                let body = [];
//
//           pdf.font('Times-Roman').text('Manpower ID :       ' + employeeId,   { width: 410, align: 'left' } );
//           pdf.font('Times-Roman').text('Manpower Name :       ' + employeesMetadata[employeeId]['name'],   { width: 410, align: 'left' } );
//           pdf.font('Times-Roman').text('Gender :       ' + employeesMetadata[employeeId]['gender'],   { width: 410, align: 'left' } );
//           pdf.font('Times-Roman').text('Shift :       ' + employeesMetadata[employeeId]['shift'],   { width: 410, align: 'left' } );
//           pdf.font('Times-Roman').text('Village :       ' + employeesMetadata[employeeId]['village'],   { width: 410, align: 'left' } );
//
//
//           table.addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({ column: 'date' }))
//                 .setColumnsDefaults({
//                     headerBorder: 'B',
//                     align: 'right'
//                 })
//                 // add table columns
//                 .addColumns([
//                     {
//                         id: 'date',
//                         header: 'Date',
//                         align: 'left',
//                           width: 80
//                     },
//                     {
//                         id: 'inTime',
//                         header: 'In Time',
//                         width: 60
//                     },
//                     {
//                         id: 'outTime',
//                         header: 'Out Time',
//                         width: 60
//                     }
//                 ])
//               // add events (here, we draw headers on each new page)
//               .onPageAdded(function (tb) {
//                   tb.addHeader();
//               });
//
//
//           let employeeDataForAllDatesArray = employeeVsDate[employeeId]; let photo=employeesMetadata[employeeId]['screenshot'];
//           let inwardPhotoUrls = [];  let outwardPhotoUrls = [];
//           //to maintain order - iterate over all the input dates
//           body.push({
//             date : '',
//             inTime : '',
//             outTime : ''
//           });
//
//           datesArr.map(date => {
//
//               let eachDateData = {};
//               employeeDataForAllDatesArray.filter((obj) => {
//                     if(obj[date] !=null) {
//                         eachDateData =  obj[date];
//                     }
//               })
//
//               console.log("eachDateData = ", eachDateData);
//               console.log("date = ", date);
//
//               if(eachDateData) {
//                 body.push({
//                   date : date || 'No Date',
//                   inTime : eachDateData['in'] || 'N/A',
//                   outTime : eachDateData['out']|| 'N/A'
//                 })
//                 if(eachDateData['inwardPhoto']) {
//                   inwardPhotoUrls.push(eachDateData['inwardPhoto']);
//                 }
//                 if(eachDateData['outwardPhoto']) {
//                   outwardPhotoUrls.push(eachDateData['outwardPhoto']);
//                 }
//               }
//           });
//
//           let downloadedInwardPhotos=[]; const dest =  os.tmpdir();
//           console.log('inwardPhotoUrls = ', inwardPhotoUrls, dest);
//
//              imageDownloader.images(inwardPhotoUrls,dest).then((result) => {
//                     console.log('result = = =', result);
//               });
//
//             if(i < 10) {
//               table.addBody(body);
//             }
//             i=i+1;
//           })  ;
//
//
//           const bucket = admin.storage().bucket();
//           const filename =  new Date().getTime() + '.pdf';
//           const file = bucket.file(filename);
//           const stream = file.createWriteStream({resumable: false});
//
//           pdf.pipe(stream);
//           pdf.end();
//
//           console.log('Done with executing the function called');
//           console.log('filename = = =', filename);
//           stream.on('finish', function () {
//               return mailIt(email, displayName, pdf);
//           });
//
//           stream.on('error', function (e) {
//               console.log('error occured with stream', e)
//           });
//
//           })
//     }).catch((e) => console.log('Could not fetch employees', e));
//
// });
//
//
// function download(url) {
//   request({ url, encoding: null });
// }
// // Sends a welcome email to the given user.
// function mailIt(email, displayName, doc) {
//
//   console.log('sending email to ', email , displayName, doc)
//
//     const mailOptions = {
//         from: '"MyCompany" <noreply@firebase.com>',
//         to: email,
//     };
//
//     mailOptions.subject = `Welcome to ${APP_NAME}!`;
//     mailOptions.text = `Hey ${displayName}!, Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
//     mailOptions.attachments =  [{filename: 'my.pdf', content: doc, contentType: 'application/pdf'  }];
//
//     return "successfully sent"
//     // return mailTransport.sendMail(mailOptions).then(() => {
//     //     console.log('New welcome email sent to:', email);
//     // });
// }
