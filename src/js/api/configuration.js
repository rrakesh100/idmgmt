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
