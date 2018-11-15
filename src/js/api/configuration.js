import * as firebase from 'firebase';

const localStorage = window.localStorage;

export function saveShift(shift) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`shifts/${shift}`] = shift;
  return dbRef.update(updates)
}

export function saveTimeslot(timeslot) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`timeslot/${timeslot}`] = timeslot;
  return dbRef.update(updates)
}

export function saveVillage(village) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`villages/${village}`] = village;
  return dbRef.update(updates)
}

export function saveVehicle(vehicleNumber) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`vehicleNumbers/${vehicleNumber}`] = vehicleNumber;
  return dbRef.update(updates)
}

export function saveDriver(driverName) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`drivers/${driverName}`] = driverName;
  return dbRef.update(updates)
}

export function saveOwnPlace(ownPlace) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`ownPlaces/${ownPlace}`] = ownPlace;
  return dbRef.update(updates)
}

export function saveMaterial(material) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`materials/${material}`] = material;
  return dbRef.update(updates)
}

export function getShifts() {
  const dbRef = firebase.database().ref('shifts');
  return dbRef.once('value');
}

export function getTimeslots() {
  const dbRef = firebase.database().ref('timeslot');
  return dbRef.once('value');
}

export function getVillages() {
  const dbRef = firebase.database().ref('villages');
  return dbRef.once('value');
}

export function getVehicleNumbers() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'vehicleNumbers');
  return dbRef.once('value');
}

export function getDrivers() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'drivers');
  return dbRef.once('value');
}

export function getOwnPlaces() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'ownPlaces');
  return dbRef.once('value');
}

export function getMaterials() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'materials');
  return dbRef.once('value');
}
