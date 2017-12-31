import * as firebase from 'firebase';
import moment from 'moment';

export function saveItem(data) {
  const date = new Date();
  const dateStr = moment(date).format('MM-YYYY');
  const dbRef = firebase.database().ref();

  const updates = {};
  updates[`items/${data.itemId}`] = data;
  updates[`monthwiseItems/${dateStr}/${data.itemId}`] = data;
  return dbRef.update(updates);
}

export function getItem(itemId) {
  const itemPath = `items/${itemId}`;
  const dbRef = firebase.database().ref(itemPath);
  return dbRef.once('value');
}

export function getItems() {
  const date = new Date();
  const dateStr = moment(date).format('MM-YYYY');
  const dbRef = firebase.database().ref(`monthwiseItems/${dateStr}`);
  return dbRef.once('value');
}

export function updateItemStatus(data) {
  const { itemId, entryTimestamp, timestamp } = data;
  const dateStr = moment(entryTimestamp).format('MM-YYYY');
  const historyRef = firebase.database().ref(`items/${itemId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[`items/${itemId}/history/${arrKey}`] = data;
  updates[`items/${itemId}/status`] = data.status;
  updates[`items/${itemId}/statusTimestamp`] = timestamp;
  updates[`monthwiseItems/${dateStr}/${data.itemId}/status`] = data.status;
  updates[`monthwiseItems/${dateStr}/${data.itemId}/statusTimestamp`] = timestamp;
  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}
