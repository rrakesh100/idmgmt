import * as firebase from 'firebase';
import moment from 'moment';

const localStorage = window.localStorage;

export function saveWorkPlace(workplace) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`workplaces/${workplace}/name`] = workplace;
  return dbRef.update(updates)
}

export function getWorkPlaces() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'workplaces');
  return dbRef.once('value');
}

export function getWorkPlace(id) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`workplaces/${id}`);
  return dbRef.once('value');
}

export function getCount(selectedZone) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`operations/${selectedZone}`);
  return dbRef.once('value');
}

export function saveEditedWorkPlace(data) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`workplaces/${data.editWorkPlaceId}/allocation/${data.shift}/male`] = data.male;
  updates[localStorage.unit + '/' +`workplaces/${data.editWorkPlaceId}/allocation/${data.shift}/female`] = data.female;
  return dbRef.update(updates);
}

export function updateWorkLocation(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`operations/${data.workLocation}/${data.gender}/${data.selectedEmployeeId}/assignedData`] = dateStr;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/currentWorkLocation`] = data.workLocation;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/workhistory/${dateStr}`] = data.workLocation;

  return dbRef.update(updates);
}
