import * as firebase from 'firebase';
import moment from 'moment';

const localStorage = window.localStorage;
export function saveVisitor(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref();

  const email = localStorage.email;
  data.savedBy = email;
  const updates = {};
  updates[localStorage.unit + '/' +`visitors/${data.visitorId}`] = data;
  updates[localStorage.unit + '/' + `daywiseVisitors/${dateStr}/${data.visitorId}`] = data;
  updates[localStorage.unit + '/' + `daywiseVisitors/${dateStr}/serialNo`] = data.serialNo + 1;
  return dbRef.update(updates);
}

// export function getAllVisitors() {
//   const dbRef = firebase.database().ref().child('visitors');
//   return dbRef.once('value');
// }
export function getVisitor(visitorId) {
  const visitorPath = localStorage.unit + '/' +`visitors/${visitorId}`;
  const dbRef = firebase.database().ref(visitorPath);
  return dbRef.once('value');
}

export function getVisitors() {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref(localStorage.unit + '/'  + `daywiseVisitors/${dateStr}/`).orderByChild('serialNo');
  return dbRef.once('value');
}

export function updateVisitorStatus(data) {
  const { visitorId, entryTimestamp, timestamp } = data;
  const dateStr = moment(entryTimestamp).format('DD-MM-YYYY');
  const historyRef = firebase.database().ref(localStorage.unit + '/' +`visitors/${visitorId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[localStorage.unit + '/' +`visitors/${visitorId}/history/${arrKey}`] = data;
  updates[localStorage.unit + '/' +`visitors/${visitorId}/status`] = data.status;
  updates[localStorage.unit + '/' +`visitors/${visitorId}/statusTimestamp`] = timestamp;
  updates[localStorage.unit + '/' +`daywiseVisitors/${dateStr}/${data.visitorId}/status`] = data.status;
  updates[localStorage.unit + '/' +`daywiseVisitors/${dateStr}/${data.visitorId}/statusTimestamp`] = timestamp;

  if (((data.status === 'RELEASE FOR DAY') || (data.status === 'ASSIGN')) && data.selectedZone) {
    const _id = data.selectedZone._id;
    if (_id) {
      updates[localStorage.unit + '/' +`liveZones/${dateStr}/${_id}/${visitorId}`] = null;
      updates[localStorage.unit + '/' +`daywiseZones/${dateStr}/${_id}/${visitorId}/releasedAt`] = timestamp;
    }
  }

  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}


export function updateVisitor(data) {
  const { visitorId, entryTimestamp, timestamp } = data;
  const dateStr = moment(entryTimestamp).format('DD-MM-YYYY');
  const historyRef = firebase.database().ref(localStorage.unit + '/' +`visitors/${visitorId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[localStorage.unit + '/' +`visitors/${visitorId}/history/${arrKey}`] = data;
  updates[localStorage.unit + '/' +`visitors/${visitorId}/status`] = data.status;
  updates[localStorage.unit + '/' +`visitors/${visitorId}/metRequiredPerson`] = data.metRequiredPerson;
  updates[localStorage.unit + '/' +`visitors/${visitorId}/statusTimestamp`] = timestamp;

  if(data.status === 'DEPARTED') {
    updates[localStorage.unit + '/' +`visitors/${visitorId}/outTime`] = timestamp;
    updates[localStorage.unit + '/' +`daywiseVisitors/${dateStr}/${data.visitorId}/outTime`] = timestamp;
  }

  updates[localStorage.unit + '/' +`daywiseVisitors/${dateStr}/${data.visitorId}/status`] = data.status;
  updates[localStorage.unit + '/' +`daywiseVisitors/${dateStr}/${data.visitorId}/metRequiredPerson`] = data.metRequiredPerson;
  updates[localStorage.unit + '/' +`daywiseVisitors/${dateStr}/${data.visitorId}/statusTimestamp`] = timestamp;

  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}


export function updateAssignedZone(data) {
  const { visitorId, entryTimestamp, timestamp, status, selectedZone, name } = data;
  const dateStr = moment(entryTimestamp).format('DD-MM-YYYY');
  const historyRef = firebase.database().ref(`visitors/${visitorId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[localStorage.unit + '/' +`visitors/${visitorId}/history/${arrKey}`] = data;
  updates[localStorage.unit + '/' +`visitors/${visitorId}/status`] = status;
  updates[localStorage.unit + '/' +`visitors/${visitorId}/statusTimestamp`] = timestamp;
  updates[localStorage.unit + '/' +`visitors/${visitorId}/selectedZone`] = selectedZone;
  updates[localStorage.unit + '/' +`daywiseVisitors/${dateStr}/${data.visitorId}/status`] = status;
  updates[localStorage.unit + '/' +`daywiseVisitors/${dateStr}/${data.visitorId}/statusTimestamp`] = timestamp;

  const { _id, name: areaName } = selectedZone;
  const visitorData = { visitorId, name, entryTimestamp, timestamp, areaName, areaId: _id };

  updates[localStorage.unit + '/' +`liveZones/${dateStr}/${_id}/${visitorId}`] = visitorData;
  updates[localStorage.unit + '/' +`daywiseZones/${dateStr}/${_id}/${visitorId}`] = visitorData;

  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}

export function uploadVisitorImage(file, visitorId) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = localStorage.unit + '/' +'Visitors/'+visitorId+'/'+epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(file, 'base64')
}
