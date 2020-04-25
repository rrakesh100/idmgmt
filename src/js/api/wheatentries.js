import * as firebase from 'firebase';
import moment from 'moment';

const localStorage = window.localStorage;

export function saveWheatEntries(wheatEntries) {
  delete wheatEntries.wheatEntriesList;
  delete wheatEntries.wheatEntries;
  delete wheatEntries.workplace;
  delete wheatEntries.workPlaceBtnClick;
  const dbRef = firebase.database().ref();
  const updates = {};
  let date = new Date().toLocaleDateString();
  date = date.replace("/", "-");
  date = date.replace("/", "-");
  updates[localStorage.unit + '/' +`wheatEntriesList/${date}/${wheatEntries.wheatVariety}`] = wheatEntries;
  return dbRef.update(updates)
}

export function getWheatEntries() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'wheatEntriesList');
  return dbRef.once('value');
}
