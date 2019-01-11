import * as firebase from 'firebase';
import moment from 'moment';

const localStorage = window.localStorage;

export function saveVehicle(data) {
  const date = new Date();
  const dateStr = moment(date).format('MM-YYYY');
  const dbRef = firebase.database().ref();
  const unitId = window.localStorage.unit || 'all';

  const updates = {};
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleId}`] = data;
  updates[localStorage.unit + '/' +`monthwiseVehicles/${dateStr}/${data.vehicleId}`] = data;
  updates[localStorage.unit + '/' +`insideVehicles/${unitId}/${data.vehicleId}`] = data;
  return dbRef.update(updates);
}

export function savingInwardVehicle(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref();
  const updates = {}; let prefix = 'U2';
  if(localStorage.unit === 'UNIT3') {
    prefix = 'U3';
  }
  updates[localStorage.unit + '/' +`vehicles/${prefix}/in/${data.inwardSNo}`] = data;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/count/inCount`] = data.lastCount+1;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastInward`] = data;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/${dateStr}/vehicleIn`] = true;
  return dbRef.update(updates);
}

export function savingOutwardVehicle(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref();
  const updates = {}; let prefix = 'U2';
  if(localStorage.unit === 'UNIT3') {
    prefix = 'U3';
  }
  updates[localStorage.unit + '/' +`vehicles/${prefix}/out/${data.outwardSNo}`] = data;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/count/outCount`] = data.lastCount+1;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastOutward`] = data;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/${dateStr}/vehicleOut`] = true;

  return dbRef.update(updates);
}

export function uploadVehicleImage(img, vehicleNumber, serialNo) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = localStorage.unit + '/' + 'Vehicles/'+vehicleNumber+'/'+serialNo+ '/'+ epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(img, 'base64')
}

export function getInwardVehicle(vehicleNumber) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicles/${vehicleNumber}/lastInward`);
  return dbRef.once('value');
}

export function getOutwardVehicle(vehicleNumber) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicles/${vehicleNumber}/lastOutward`);
  return dbRef.once('value');
}

export function getUserInfo(token) {
  const userInfoPath=localStorage.unit + '/' +`userInfo/${token}`;
  const dbRef = firebase.database().ref(userInfoPath);
  return dbRef.once('value');
}

export function getVehicle(vehicleId) {
  const vehiclePath = localStorage.unit + '/' +`vehicles/${vehicleId}`;
  const dbRef = firebase.database().ref(vehiclePath);
  return dbRef.once('value');
}

export function getVehicleData(vehicleNumber) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const vehiclePath = localStorage.unit + '/' +`vehicles/${vehicleNumber}/${dateStr}`;
  const dbRef = firebase.database().ref(vehiclePath);
  return dbRef.once('value');
}

export function getVehicles() {
  const date = new Date();
  const dateStr = moment(date).format('MM-YYYY');
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`monthwiseVehicles/${dateStr}`);
  return dbRef.once('value');
}

export function getAllVehicles() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'vehicles');
  return dbRef.once('value');
}

export function updateVehicleStatus(data) {
  const { vehicleId, entryTimestamp, timestamp } = data;
  const dateStr = moment(entryTimestamp).format('MM-YYYY');
  const historyRef = firebase.database().ref(localStorage.unit + '/' +`vehicles/${vehicleId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[localStorage.unit + '/' +`vehicles/${vehicleId}/history/${arrKey}`] = data;
  updates[localStorage.unit + '/' +`vehicles/${vehicleId}/status`] = data.status;
  updates[localStorage.unit + '/' +`vehicles/${vehicleId}/statusTimestamp`] = timestamp;
  updates[localStorage.unit + '/' +`monthwiseVehicles/${dateStr}/${data.vehicleId}/status`] = data.status;
  updates[localStorage.unit + '/' +`monthwiseVehicles/${dateStr}/${data.vehicleId}/statusTimestamp`] = timestamp;
  const dbRef = firebase.database().ref();
  const unitId = window.localStorage.unit || 'all';

  if(data.status === 'LET GO' || data.status === 'ALLOW OUT') {
    const insideVehiclesRef = dbRef.child('insideVehicles/'+ unitId + '/' + vehicleId );
    insideVehiclesRef.remove();

  }else {
    updates[localStorage.unit + '/' +`insideVehicles/${unitId}/${vehicleId}`] = data;
  }
  return dbRef.update(updates);
}

export function saveVehicleInPrintCopiesData(vehicleKey, printData) {
  const dbRef = firebase.database().ref();
  const updates = {};
  if(printData) {
    updates[`vehicleInPrintCopies/${vehicleKey}`] = printData + 1;
  } else {
    updates[`vehicleInPrintCopies/${vehicleKey}`] = 1;
  }

  return dbRef.update(updates);
}

export function saveVehicleOutPrintCopiesData(vehicleKey, printData) {
  console.log(vehicleKey);
  console.log(printData);
  const dbRef = firebase.database().ref();
  const updates = {};
  if(printData) {
    updates[`vehicleOutPrintCopies/${vehicleKey}`] = printData + 1;
  } else {
    updates[`vehicleOutPrintCopies/${vehicleKey}`] = 1;
  }

  return dbRef.update(updates);
}


export function fetchVehicleInPrintCopiesData(vehicleKey) {
  const dbRef = firebase.database().ref(`vehicleInPrintCopies/${vehicleKey}`);
  return dbRef.once('value');
}

export function fetchVehicleOutPrintCopiesData(vehicleKey) {
  const dbRef = firebase.database().ref(`vehicleOutPrintCopies/${vehicleKey}`);
  return dbRef.once('value');
}
