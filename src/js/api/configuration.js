import * as firebase from 'firebase';


export function saveShift(shift) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`shifts/${shift}`] = shift;
  return dbRef.update(updates)
}

export function saveTimeslot(timeslot) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`timeslot/${timeslot}`] = timeslot;
  return dbRef.update(updates)
}

export function saveVillage(village) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`villages/${village}`] = village;
  return dbRef.update(updates)
}

export function saveVehicle(vehicleNumber) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`vehicleNumbers/${vehicleNumber}`] = vehicleNumber;
  return dbRef.update(updates)
}

export function saveDriver(driverName) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`drivers/${driverName}`] = driverName;
  return dbRef.update(updates)
}

export function saveOwnPlace(ownPlace) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`ownPlaces/${ownPlace}`] = ownPlace;
  return dbRef.update(updates)
}

export function saveMaterial(material) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`materials/${material}`] = material;
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

export function getVehicles() {
  const dbRef = firebase.database().ref('vehicleNumbers');
  return dbRef.once('value');
}

export function getDrivers() {
  const dbRef = firebase.database().ref('drivers');
  return dbRef.once('value');
}

export function getOwnPlaces() {
  const dbRef = firebase.database().ref('ownPlaces');
  return dbRef.once('value');
}

export function getMaterials() {
  const dbRef = firebase.database().ref('materials');
  return dbRef.once('value');
}
