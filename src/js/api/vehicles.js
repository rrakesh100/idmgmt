import * as firebase from 'firebase';
import moment from 'moment';

export function saveVehicle(data) {
  const date = new Date();
  const dateStr = moment(date).format('MM-YYYY');
  const dbRef = firebase.database().ref();
  const unitId = window.localStorage.unit || 'all';

  const updates = {};
  updates[`vehicles/${data.vehicleId}`] = data;
  updates[`monthwiseVehicles/${dateStr}/${data.vehicleId}`] = data;
  updates[`insideVehicles/${unitId}/${data.vehicleId}`] = data;
  return dbRef.update(updates);
}

export function getUserInfo(token) {
  const userInfoPath=`userInfo/${token}`;
  const dbRef = firebase.database().ref(userInfoPath);
  return dbRef.once('value');
}

export function getVehicle(vehicleId) {
  const vehiclePath = `vehicles/${vehicleId}`;
  const dbRef = firebase.database().ref(vehiclePath);
  return dbRef.once('value');
}

export function getVehicles() {
  const date = new Date();
  const dateStr = moment(date).format('MM-YYYY');
  const dbRef = firebase.database().ref(`monthwiseVehicles/${dateStr}`);
  return dbRef.once('value');
}

export function updateVehicleStatus(data) {
  const { vehicleId, entryTimestamp, timestamp } = data;
  const dateStr = moment(entryTimestamp).format('MM-YYYY');
  const historyRef = firebase.database().ref(`vehicles/${vehicleId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[`vehicles/${vehicleId}/history/${arrKey}`] = data;
  updates[`vehicles/${vehicleId}/status`] = data.status;
  updates[`vehicles/${vehicleId}/statusTimestamp`] = timestamp;
  updates[`monthwiseVehicles/${dateStr}/${data.vehicleId}/status`] = data.status;
  updates[`monthwiseVehicles/${dateStr}/${data.vehicleId}/statusTimestamp`] = timestamp;
  const dbRef = firebase.database().ref();
  const unitId = window.localStorage.unit || 'all';

  const insideVehiclesRef = dbRef.child('insideVehicles/'+ unitId + '/' + vehicleId );
  updates[`insideVehicles/${unitId}/${vehicleId}`] = data;
  return dbRef.update(updates);
}
