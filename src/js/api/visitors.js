import * as firebase from 'firebase';
import moment from 'moment';

export function saveVisitor(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref();

  const updates = {};
  updates[`visitors/${data.visitorId}`] = data;
  updates[`daywiseVisitors/${dateStr}/${data.visitorId}`] = data;
  return dbRef.update(updates);
}

export function getVisitor(visitorId) {
  const visitorPath = `visitors/${visitorId}`;
  const dbRef = firebase.database().ref(visitorPath);
  return dbRef.once('value');
}

export function getVisitors() {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref(`daywiseVisitors/${dateStr}`);
  return dbRef.once('value');
}

export function updateVisitorStatus(data) {
  const { visitorId, entryTimestamp, timestamp } = data;
  const dateStr = moment(entryTimestamp).format('DD-MM-YYYY');
  const historyRef = firebase.database().ref(`visitors/${visitorId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[`visitors/${visitorId}/history/${arrKey}`] = data;
  updates[`visitors/${visitorId}/status`] = data.status;
  updates[`visitors/${visitorId}/statusTimestamp`] = timestamp;
  updates[`daywiseVisitors/${dateStr}/${data.visitorId}/status`] = data.status;
  updates[`daywiseVisitors/${dateStr}/${data.visitorId}/statusTimestamp`] = timestamp;

  if (((data.status === 'RELEASE FOR DAY') || (data.status === 'ASSIGN')) && data.selectedZone) {
    const _id = data.selectedZone._id;
    if (_id) {
      updates[`liveZones/${dateStr}/${_id}/${visitorId}`] = null;
      updates[`daywiseZones/${dateStr}/${_id}/${visitorId}/releasedAt`] = timestamp;
    }
  }

  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}


export function updateAssignedZone(data) {
  const { visitorId, entryTimestamp, timestamp, status, selectedZone, name } = data;
  const dateStr = moment(entryTimestamp).format('DD-MM-YYYY');
  const historyRef = firebase.database().ref(`visitors/${visitorId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[`visitors/${visitorId}/history/${arrKey}`] = data;
  updates[`visitors/${visitorId}/status`] = status;
  updates[`visitors/${visitorId}/statusTimestamp`] = timestamp;
  updates[`visitors/${visitorId}/selectedZone`] = selectedZone;
  updates[`daywiseVisitors/${dateStr}/${data.visitorId}/status`] = status;
  updates[`daywiseVisitors/${dateStr}/${data.visitorId}/statusTimestamp`] = timestamp;

  const { _id, name: areaName } = selectedZone;
  const visitorData = { visitorId, name, entryTimestamp, timestamp, areaName, areaId: _id };

  updates[`liveZones/${dateStr}/${_id}/${visitorId}`] = visitorData;
  updates[`daywiseZones/${dateStr}/${_id}/${visitorId}`] = visitorData;

  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}

export function uploadVisitorImage(file, visitorId) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = 'Visitors/'+visitorId+'/'+epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(file, 'base64')
}
