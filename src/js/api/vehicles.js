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

export function getPrefix() {
  let prefix = 'U2';
  if(localStorage.unit === 'UNIT3') {
    prefix = 'U3';
  } else if(localStorage.unit === 'UNIT1') {
    prefix = 'U1';
  } else if (localStorage.unit === 'BIKKAVOLU') {
    prefix = 'BV';
  } else if (localStorage.unit === 'CHOLLANGI') {
    prefix = 'CH';
  } else if (localStorage.unit === 'KESAVARAM') {
    prefix = 'KS';
  } else if (localStorage.unit === 'KOVVURU') {
    prefix = 'KV';
  } else if (localStorage.unit === 'PEDDAPURAPPADU') {
    prefix = 'PD';
  } else if (localStorage.unit === 'SURAMPALEM') {
    prefix = 'SU';
  } else if (localStorage.unit === 'SVPC') {
    prefix = 'SVP';
  } else if (localStorage.unit === 'TAPESWARAM') {
    prefix = 'TP';
  } else if (localStorage.unit === 'UPPALANKA') {
    prefix = 'UL';
  } else if (localStorage.unit === 'VASAVI') {
    prefix = 'VS';
  }
  return prefix;
}

export function savingInwardVehicle(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();
  const updates = {};
  let prefix=getPrefix();

  let vehicleBarcodesObj = {
    inwardSNo: data.inwardSNo,
    ownOutVehicle: data.ownOutVehicle,
    vehicleNumber: data.vehicleNumber,
    driverName: data.driverName,
    driverNumber: data.driverNumber,
    emptyLoad: data.emptyLoad,
    partyName: data.partyName,
    material: data.material,
    numberOfBags: data.numberOfBags,
    comingFrom: data.comingFrom,
    billNumber: data.billNumber,
    remarks: data.remarks,
    inDate: dateStr,
    inTime: timeStr,
    inSide: true
  }

  const vehicleReportsObj = Object.assign({}, vehicleBarcodesObj);
  vehicleReportsObj.savedBy = localStorage.email;
  vehicleReportsObj.inSide = true;

  const newData = Object.assign({}, data);
  newData.inwardDate= dateStr;
  newData.inTime=timeStr;
  updates[localStorage.unit + '/' +`vehicles/${prefix}/count/inCount`] = data.lastCount+1;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastInward`] = newData;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastOutward`] = null;

  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}`] = vehicleBarcodesObj;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.inwardSNo}`] = vehicleReportsObj;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${data.vehicleNumber}/${data.inwardSNo}`] = vehicleReportsObj;

  return dbRef.update(updates);
}

export function savingOutwardVehicle(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();
  const updates = {}; let prefix = getPrefix();
  const newData = Object.assign({}, data);
  newData.outwardDate= dateStr;
  newData.outTime=timeStr;

    if(data.inwardDate) {
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/inSide`]=false;
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/outDate`]=dateStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/outTime`]=timeStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/outwardSNo`]=data.outwardSNo;
    updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${data.vehicleNumber}/${data.inwardDate}/${data.inwardSNo}/goingTo`]=data.goingTo;

    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/inSide`]=false;
    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/outDate`]=dateStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/outTime`]=timeStr;
    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/outwardSNo`]=data.outwardSNo;
    updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${data.inwardDate}/${data.vehicleNumber}/${data.inwardSNo}/goingTo`]=data.goingTo;
  }

  const vehicleBarcodesObj = {
    outDate: dateStr,
    outTime: timeStr,
    inSide: false
  }

  const outwardObj = {
    outwardSNo: data.outwardSNo,
    ownOutVehicle: data.ownOutVehicle,
    vehicleNumber: data.vehicleNumber,
    driverName: data.driverName,
    driverNumber: data.driverNumber,
    emptyLoad: data.emptyLoad,
    partyName: data.partyName,
    material: data.material,
    numberOfBags: data.numberOfBags,
    goingTo: data.goingTo,
    billNumber: data.billNumber,
    remarks: data.remarks,
    outDate: dateStr,
    outTime: timeStr,
    inDate: data.inwardDate,
    inTime: data.inTime,
    comingFrom: data.comingFrom,
    inwardSNo: data.inwardSNo
  }

  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/outDate`]=dateStr;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/outTime`]=timeStr;
  updates[localStorage.unit + '/' +`vehicleBarcodes/${data.inwardSNo}/inSide`]=false;

  updates[localStorage.unit + '/' +`vehicles/${prefix}/count/outCount`] = data.lastCount+1;
  updates[localStorage.unit + '/' +`vehicles/${data.vehicleNumber}/lastOutward`] = newData;
  updates[localStorage.unit + '/' +`vehicleReports/out/vehicleWise/${data.vehicleNumber}/${dateStr}/${data.outwardSNo}`] = outwardObj;
  updates[localStorage.unit + '/'+`vehicleReports/out/dateWise/${dateStr}/${data.vehicleNumber}/${data.outwardSNo}`] = outwardObj;

  return dbRef.update(updates);
}

export function fetchVehicleReportsData(report, unit) {
  let unitsArray = ['BIKKAVOLU','CHOLLANGI'];
  let reportType, unitName;
  if(report == 'Outward') {
    reportType = 'out';
  } else {
    reportType = 'in';
  }

  if(unit) {
    if(unit === 'UNIT2')
    unitName='';
    else
    unitName=unit;
  } else {
    unitName=localStorage.unit;
  }
  const dbRef = firebase.database().ref(unitName + '/' + `vehicleReports/${reportType}/dateWise`);
  return dbRef.once('value');
}

export function fetchAllVehicles() {
  const dbRef =firebase.database().ref(localStorage.unit + '/' + `vehicleReports/in/dateWise`);
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

export function getLastVehicleInCount() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicles/${getPrefix()}/count/inCount/`);
  return dbRef.once('value');
}

export function getLastVehicleOutCount() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicles/${getPrefix()}/count/outCount/`);
  return dbRef.once('value');
}

export function getVehicleForPrint(vNo) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`vehicles/${vNo}`);
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
    updates[localStorage.unit + '/' + `vehicleOutPrintCopies/${vehicleKey}`] = printData + 1;
  } else {
    updates[localStorage.unit + '/' + `vehicleOutPrintCopies/${vehicleKey}`] = 1;
  }

  return dbRef.update(updates);
}

export function forceReset(vNo) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' + `vehicleReports/in/vehicleWise/${vNo}`);
  const dbReference=firebase.database().ref();
  const updates={};
  dbRef.once('value').then(snap => {
    let dbObj=snap.val();
    Object.keys(dbObj).map(date => {
      let sNoObj=dbObj[date];
      Object.keys(sNoObj).map(sNoKey => {
        let sNoData=sNoObj[sNoKey];
        updates[localStorage.unit + '/' + `vehicleReports/in/vehicleWise/${vNo}/${date}/${sNoKey}/inSide`]=false;
        return dbReference.update(updates)
      })
    })
  })
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
  const dbRef = firebase.database().ref(localStorage.unit + '/' + `vehicleBarcodes/${barcodeNo}`);
  return dbRef.once('value');
}

export function rollbackData(barcodeNo, vNo) {
  const dbRef = firebase.database().ref();
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');

  const updates={};

  updates[localStorage.unit + '/' + `vehicleBarcodes/${barcodeNo}`] = null;
  updates[localStorage.unit + '/' +`vehicleReports/in/vehicleWise/${vNo}/${dateStr}/${barcodeNo}`] = null;
  updates[localStorage.unit + '/' +`vehicleReports/in/dateWise/${dateStr}/${vNo}/${barcodeNo}`] = null;

  return dbRef.update(updates);
}
