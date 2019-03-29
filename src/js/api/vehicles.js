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
  const updates = {};
  let prefix = 'U2';
  if(localStorage.unit === 'UNIT3') {
    prefix = 'U3';
  } else if(localStorage.unit === 'UNIT1') {
    prefix = 'U1';
  } else if (localStorage.unit === 'UNIT3') {
    prefix = 'U3';
  } else if (localStorage.unit === 'UNIT5') {
    prefix = 'U5';
  } else if (localStorage.unit === 'AYYAPPA') {
    prefix = 'AG';
  } else if (localStorage.unit === 'SURAMPALEM') {
    prefix = 'SP';
  } else if (localStorage.unit === 'SVPC') {
    prefix = 'SV';
  }
  const newData = Object.assign({}, data);
  newData.inwardDate= dateStr;
  newData.inTime=timeStr;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/in/${data.inwardSNo}`] = data;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/count/inCount`] = data.lastCount+1;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastInward`] = newData;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastOutward`] = null;

  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/inwardSNo`] = data.inwardSNo;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/driverName`] = data.driverName;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/partyName`] = data.partyName;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/material`] = data.material;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/comingFrom`] = data.comingFrom;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/remarks`] = data.remarks;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/inDate`] = dateStr;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/inTime`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/inSide`] = true;
  /*
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
  */

  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/inwardSNo`] = data.inwardSNo;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/driverName`] = data.driverName;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/partyName`] = data.partyName;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/material`] = data.material;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/comingFrom`] = data.comingFrom;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/remarks`] = data.remarks;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/inDate`] = dateStr;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/inTime`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/savedBy`] = localStorage.email;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}/inSide`] = true;

  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/inwardSNo`] = data.inwardSNo;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/driverName`] = data.driverName;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/partyName`] = data.partyName;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/material`] = data.material;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/comingFrom`] = data.comingFrom;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/remarks`] = data.remarks;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/inDate`] = dateStr;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/inTime`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/savedBy`] = localStorage.email;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}/inSide`] = true;
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
  const newData = Object.assign({}, data);
  newData.outwardDate= dateStr;
  newData.outTime=timeStr;

  if(data.inwardDate) {
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/inSide`] = false;
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/outDate`] = dateStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/outTime`] = timeStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/outwardSNo`] = data.outwardSNo;
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/goingTo`] = data.goingTo;

    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/inSide`] = false;
    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/outDate`] = dateStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/outTime`] = timeStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/outwardSNo`] = data.outwardSNo;
    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/goingTo`] = data.goingTo;
  }

  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/outDate`] = dateStr;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/outTime`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/inSide`] = false;

  updates[localStorage.unit + '/' +`vehicles/${prefix}/out/${data.outwardSNo}`] = newData;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/count/outCount`] = data.lastCount+1;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastOutward`] = newData;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/outwardSNo`] = data.outwardSNo;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/driverName`] = data.driverName;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/partyName`] = data.partyName;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/material`] = data.material;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/goingTo`] = data.goingTo;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/remarks`] = data.remarks;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/outDate`] = dateStr;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/outTime`] = timeStr;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/inDate`] = data.inwardDate;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/inTime`] = data.inTime;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/comingFrom`] = data.comingFrom;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}/inwardSNo`] = data.inwardSNo;

  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/outwardSNo`] = data.outwardSNo;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/ownOutVehicle`] = data.ownOutVehicle;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/vehicleNumber`] = data.vehicleNumber;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/driverName`] = data.driverName;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/driverNumber`] = data.driverNumber;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/emptyLoad`] = data.emptyLoad;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/partyName`] = data.partyName;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/material`] = data.material;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/numberOfBags`] = data.numberOfBags;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/goingTo`] = data.goingTo;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/billNumber`] = data.billNumber;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/remarks`] = data.remarks;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/outDate`] = dateStr;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/outTime`] = timeStr;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/inDate`] = data.inwardDate;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/inTime`] = data.inTime;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/comingFrom`] = data.comingFrom;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}/inwardSNo`] = data.inwardSNo;

  return dbRef.update(updates);
}

export function fetchVehicleReportsData(report, startDate, endDate) {
  let reportType;
  if(report == 'Outward') {
    reportType = 'out';
  } else {
    reportType = 'in';
  }
  const dbRef = firebase.database().ref(localStorage.unit + '/' + `vehicleReports/${reportType}/dateWise`);
  return dbRef.once('value');
}

export function getVehicleAbstractData(startDate) {
  let startDateParts = startDate.split("-");
  let startDateObj = new Date(startDateParts[2], startDateParts[1]-1, startDateParts[0]);
  let tokenizedDate = moment(startDateObj).format('DD-MM-YYYY');
  const dbRef=firebase.database().ref(localStorage.unit + '/' + `vehicleReports/in/dateWise/${tokenizedDate}`);
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

export function getVehicleForValidation(vehicleNumber) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${vehicleNumber}`);
  return dbRef.once('value');
}

export function getInsideVehicles(vehicleNumber) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicleReports/in/vehicleWise`);
  return dbRef.once('value');
}

export function getOutsideVehicles(vehicleNumber) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicleReports/out`);
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
  const dbRef = firebase.database().ref(localStorage.unit + '/' + `vehicleInPrintCopies/${vehicleKey}`);
  return dbRef.once('value');
}

export function fetchVehicleOutPrintCopiesData(vehicleKey) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicleOutPrintCopies/${vehicleKey}`);
  return dbRef.once('value');
}

export function getVehicleBarcodes() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' + 'vehicleBarcodes');
  return dbRef.once('value');
}

export function fetchVehicleBarcodeData(barcodeNo) {
  console.log(barcodeNo);
  const dbRef = firebase.database().ref(localStorage.unit + '/' + `vehicleBarcodes/${barcodeNo}`);
  return dbRef.once('value');
}
