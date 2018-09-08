import * as firebase from 'firebase';
import moment from 'moment';
const localStorage = window.localStorage;

export function saveItem(data) {
  const date = new Date();
  const dateStr = moment(date).format('MM-YYYY');
  const dbRef = firebase.database().ref();

  const updates = {};
  updates[localStorage.unit + '/' +`items/${data.itemId}`] = data;
  updates[localStorage.unit + '/' +`monthwiseItems/${dateStr}/${data.itemId}`] = data;
  return dbRef.update(updates);
}

export function getItem(itemId) {
  const itemPath = localStorage.unit + '/' +`items/${itemId}`;
  const dbRef = firebase.database().ref(itemPath);
  return dbRef.once('value');
}

export function getItems() {
  const date = new Date();
  const dateStr = moment(date).format('MM-YYYY');
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`monthwiseItems/${dateStr}`);
  return dbRef.once('value');
}

export function updateItemStatus(data) {
  const { itemId, entryTimestamp, timestamp } = data;
  const dateStr = moment(entryTimestamp).format('MM-YYYY');
  const historyRef = firebase.database().ref(localStorage.unit + '/' +`items/${itemId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[localStorage.unit + '/' +`items/${itemId}/history/${arrKey}`] = data;
  updates[localStorage.unit + '/' +`items/${itemId}/status`] = data.status;
  updates[localStorage.unit + '/' +`items/${itemId}/statusTimestamp`] = timestamp;
  updates[localStorage.unit + '/' +`monthwiseItems/${dateStr}/${data.itemId}/status`] = data.status;
  updates[localStorage.unit + '/' +`monthwiseItems/${dateStr}/${data.itemId}/statusTimestamp`] = timestamp;
  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}

export function uploadItemImage(file, itemId) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = localStorage.unit + '/' +'Items/'+'/'+itemId+'/'+epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(file, 'base64')
}
