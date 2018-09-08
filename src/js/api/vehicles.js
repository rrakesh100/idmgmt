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

export function savingInwardVehicle(data) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`vehicles/U2/in/${data.inwardSNo}`] = data;
  updates[`vehicles/U2/count/inCount`] = data.lastCount+1;
  updates[`vehicles/${data.vehicleNumber}/lastInward/${data.inwardSNo}`] = data;
  return dbRef.update(updates);
}

export function savingOutwardVehicle(data) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`vehicles/U2/out/${data.outwardSNo}`] = data;
  updates[`vehicles/U2/count/outCount`] = data.lastCount+1;
  updates[`vehicles/${data.vehicleNumber}/lastOutward/${data.outwardSNo}`] = data;
  return dbRef.update(updates);
}

export function uploadVehicleImage(img, vehicleNumber, serialNo) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = 'Vehicles/'+vehicleNumber+'/'+serialNo+ '/'+ epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(img, 'base64')
}

export function getInwardVehicle(vehicleNumber) {
  const dbRef = firebase.database().ref(`vehicles/${vehicleNumber}/lastInward`);
  return dbRef.once('value');
}

export function getOutwardVehicle(vehicleNumber) {
  const dbRef = firebase.database().ref(`vehicles/${vehicleNumber}/lastOutward`);
  return dbRef.once('value');
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

export function getAllVehicles() {
  const dbRef = firebase.database().ref('vehicles');
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

  if(data.status === 'LET GO' || data.status === 'ALLOW OUT') {
    const insideVehiclesRef = dbRef.child('insideVehicles/'+ unitId + '/' + vehicleId );
    insideVehiclesRef.remove();

  }else {
    updates[`insideVehicles/${unitId}/${vehicleId}`] = data;
  }
  return dbRef.update(updates);
}
