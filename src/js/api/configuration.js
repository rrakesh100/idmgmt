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
  updates[`villages/${village}`] = village;
  return dbRef.update(updates)
}

export function saveVehicle(vehicleNumber,unit,driver1Name,d1CellNum,driver2Name,d2CellNum) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`vehicleNumbers/${vehicleNumber}/vehicleNumber`] = vehicleNumber;
  updates[`vehicleNumbers/${vehicleNumber}/unit`] = unit;
  updates[`vehicleNumbers/${vehicleNumber}/driver1Name`] = driver1Name;
  updates[`vehicleNumbers/${vehicleNumber}/d1CellNum`] = d1CellNum;
  updates[`vehicleNumbers/${vehicleNumber}/driver2Name`] = driver2Name;
  updates[`vehicleNumbers/${vehicleNumber}/d2CellNum`] = d2CellNum;
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

export function saveLocation(location) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`allLocations/${location}`] = location;
  return dbRef.update(updates)
}

export function saveMaterial(material) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`materials/${material}`] = material;
  return dbRef.update(updates)
}

export function saveParty(partyName,partyNum,partyTown,partyDistrict,partyState) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`parties/${partyName}/partyName`] = partyName;
  updates[`parties/${partyName}/partyNum`] = partyNum;
  updates[`parties/${partyName}/partyTown`] = partyTown;
  updates[`parties/${partyName}/partyDistrict`] = partyDistrict;
  updates[`parties/${partyName}/partyState`] = partyState;
  return dbRef.update(updates)
}

export function saveAgent(agentName,agentNum,agentTown,agentDistrict,agentState) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`agents/${agentName}/agentName`] = agentName;
  updates[`agents/${agentName}/agentNum`] = agentNum;
  updates[`agents/${agentName}/agentTown`] = agentTown;
  updates[`agents/${agentName}/agentDistrict`] = agentDistrict;
  updates[`agents/${agentName}/agentState`] = agentState;
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

export function getParties() {
  const dbRef = firebase.database().ref('parties');
  return dbRef.once('value');
}

export function getAgents() {
  const dbRef = firebase.database().ref('agents');
  return dbRef.once('value');
}
