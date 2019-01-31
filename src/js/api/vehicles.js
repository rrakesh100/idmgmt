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
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();
  const updates = {}; let prefix = 'U2';
  if(localStorage.unit === 'UNIT3') {
    prefix = 'U3';
  }
  const newData = Object.assign({}, data);
  newData.inwardDate= dateStr;
  newData.inTime=timeStr;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/in/${data.inwardSNo}`] = data;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/count/inCount`] = data.lastCount+1;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastInward`] = newData;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/savedBy`] = localStorage.email;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/in`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/inwardSNo`] = data.inwardSNo;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/driverName`] = data.driverName;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/partyName`] = data.partyName;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/material`] = data.material;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/comingFrom`] = data.comingFrom;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/remarks`] = data.remarks;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/inwardPhoto`] = data.inwardPhoto;

  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/inwardSNo`] = data.inwardSNo;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/driverName`] = data.driverName;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/partyName`] = data.partyName;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/material`] = data.material;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/comingFrom`] = data.comingFrom;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/remarks`] = data.remarks;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/inwardPhoto`] = data.inwardPhoto;

  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/inwardSNo`] = data.inwardSNo;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/driverName`] = data.driverName;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/partyName`] = data.partyName;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/material`] = data.material;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/comingFrom`] = data.comingFrom;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/remarks`] = data.remarks;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/inwardPhoto`] = data.inwardPhoto;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/inDate`] = dateStr;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/inTime`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${dateStr}/inSide`] = true;
  return dbRef.update(updates);
}

export function savingOutwardVehicle(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();
  const updates = {}; let prefix = 'U2';
  if(localStorage.unit === 'UNIT3') {
    prefix = 'U3';
  }

  if(data.inwardDate) {
    updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${data.inwardDate}/inSide`] = false;
    updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${data.inwardDate}/outDate`] = dateStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${data.inwardDate}/outTime`] = timeStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${data.inwardDate}/outwardSNo`] = data.outwardSNo;
    updates[localStorage.unit + '/' +`vehicleReports/in/${data.vehicleNumber}/${data.inwardDate}/goingTo`] = data.goingTo;
  }

  updates[localStorage.unit + '/' +`vehicles/${prefix}/out/${data.outwardSNo}`] = data;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/count/outCount`] = data.lastCount+1;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastOutward`] = data;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/out`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleReports/dates/${dateStr}/${data.vehicleNumber}/outwardPhoto`] = data.outwardPhoto;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/out`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleReports/vehicles/${data.vehicleNumber}/${dateStr}/outwardPhoto`] = data.outwardPhoto;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/outwardSNo`] = data.outwardSNo;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/driverName`] = data.driverName;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/partyName`] = data.partyName;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/material`] = data.material;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/goingTo`] = data.goingTo;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/remarks`] = data.remarks;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/outwardPhoto`] = data.outwardPhoto;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/outDate`] = dateStr;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/outTime`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/inDate`] = data.inwardDate;
  updates[localStorage.unit + '/' +`vehicleReports/out/${data.vehicleNumber}/${dateStr}/inTime`] = data.inTime;


  return dbRef.update(updates);
}

export function fetchVehicleReportsData(report) {
  let reportType;
  if(report == 'Outward' ) {
    reportType = 'out';
  } else {
    reportType = 'in';
  }
  const dbRef = firebase.database().ref(localStorage.unit + '/' + `vehicleReports/${reportType}`);
  return dbRef.once('value');
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
