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

export function saveVehicle(vehicleNumber,unit,driver1Name,d1CellNum,driver2Name,d2CellNum) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`vehicleNumbers/${vehicleNumber}/vehicleNumber`] = vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleNumbers/${vehicleNumber}/unit`] = unit;
  updates[localStorage.unit + '/' +`vehicleNumbers/${vehicleNumber}/driver1Name`] = driver1Name;
  updates[localStorage.unit + '/' +`vehicleNumbers/${vehicleNumber}/d1CellNum`] = d1CellNum;
  updates[localStorage.unit + '/' +`vehicleNumbers/${vehicleNumber}/driver2Name`] = driver2Name;
  updates[localStorage.unit + '/' +`vehicleNumbers/${vehicleNumber}/d2CellNum`] = d2CellNum;
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

export function saveLocation(location) {
  console.log(location);
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`allLocations/${location}`] = location;
  return dbRef.update(updates)
}

export function saveMaterial(material) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`materials/${material}`] = material;
  return dbRef.update(updates)
}

export function saveParty(partyName,partyNum,partyTown,partyDistrict,partyState) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`parties/${partyName}/partyName`] = partyName;
  updates[localStorage.unit + '/' +`parties/${partyName}/partyNum`] = partyNum;
  updates[localStorage.unit + '/' +`parties/${partyName}/partyTown`] = partyTown;
  updates[localStorage.unit + '/' +`parties/${partyName}/partyDistrict`] = partyDistrict;
  updates[localStorage.unit + '/' +`parties/${partyName}/partyState`] = partyState;
  return dbRef.update(updates)
}

export function saveAgent(agentName,agentNum,agentTown,agentDistrict,agentState) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[localStorage.unit + '/' +`agents/${agentName}/agentName`] = agentName;
  updates[localStorage.unit + '/' +`agents/${agentName}/agentNum`] = agentNum;
  updates[localStorage.unit + '/' +`agents/${agentName}/agentTown`] = agentTown;
  updates[localStorage.unit + '/' +`agents/${agentName}/agentDistrict`] = agentDistrict;
  updates[localStorage.unit + '/' +`agents/${agentName}/agentState`] = agentState;
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

export function getParties() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'parties');
  return dbRef.once('value');
}

export function getAgents() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'agents');
  return dbRef.once('value');
}
