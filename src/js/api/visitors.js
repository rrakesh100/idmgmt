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
  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}
