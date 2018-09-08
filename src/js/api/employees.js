import * as firebase from 'firebase';
import moment from 'moment';

const localStorage = window.localStorage;

export function saveEmployee(data) {
  let count = 1;
  const gender = data.gender;
  const countObj = data.countObj;
  const date = new Date();
  const timeStr = moment(date).format('h:mm A');

  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref();
  const updates = {};
  delete data['countObj']
  const newData = Object.assign({}, data)

  updates[localStorage.unit + '/' +`employees/${data.employeeId}`] = newData;
  updates[localStorage.unit + '/' +`daywiseEmployees/${dateStr}/${data.employeeId}`] = newData;
  if(gender == 'Male' && data.paymentType !== 'Jattu-Daily payment') {
  updates[localStorage.unit + '/' +`employees/count/maxMaleCount`] = countObj.maxMaleCount + 1;
  }
  else if(gender == 'Female' && data.paymentType !== 'Jattu-Daily payment') {
    updates[localStorage.unit + '/' +`employees/count/maxFemaleCount`] = countObj.maxFemaleCount + 1;
  } else {
    updates[localStorage.unit + '/' +`employees/count/maxJattuCount`] = countObj.maxJattuCount + 1;
  }

  return dbRef.update(updates);
  }



  export function getTodaysEmployees() {
    const date = new Date();
    const dateStr = moment(date).format('DD-MM-YYYY');
    const dbRef = firebase.database().ref(localStorage.unit + '/' +`attendance/dates/${dateStr}/`);
    return dbRef.once('value');
  }

  export function saveEditedEmployee(data) {
    console.log(data);
    const dbRef = firebase.database().ref();
    const updates = {};
    updates[localStorage.unit + '/' +`employees/${data.employeeId}`] = data;

    return dbRef.update(updates);
  }

  export function saveAttendaceEmployee(data) {
    console.log(data);
    const date = new Date();
    const timeStr = moment(date).format('h:mm A');

    const dateStr = moment(date).format('DD-MM-YYYY');
    const dbRef = firebase.database().ref();
    const updates = {};
    updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}`] = data;
    updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/in`] = timeStr;
    updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/name`] = data.selectedEmployeeName;
    updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/shift`] = data.shift;
    updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/numberOfPersons`] = data.numberOfPersons;
    updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/inwardPhoto`] = data.inwardPhoto;

    return dbRef.update(updates);
  }

export function getEmployee(employeeId) {
  const employeePath = localStorage.unit + '/' +`employees/${employeeId}`;
  const dbRef = firebase.database().ref(employeePath);
  return dbRef.once('value');
}

export function getEmployees() {
  const date = new Date();
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'employees');
  return dbRef.once('value');
}

export function removeEmployee(employeeId, paymentType, gender, countObj) {

  const dbRef = firebase.database().ref();
  const employeeDbRef = firebase.database().ref(localStorage.unit + '/' +`employees/${employeeId}`);

  return employeeDbRef.remove();
}

export function updateEmployeeStatus(data) {
  const { employeeId, entryTimestamp, timestamp } = data;
  const dateStr = moment(entryTimestamp).format('DD-MM-YYYY');
  const historyRef = firebase.database().ref(localStorage.unit + '/' + `employees/${employeeId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[localStorage.unit + '/' +`employees/${employeeId}/history/${arrKey}`] = data;
  updates[localStorage.unit + '/' +`employees/${employeeId}/status`] = data.status;
  updates[localStorage.unit + '/' +`employees/${employeeId}/statusTimestamp`] = timestamp;
  updates[localStorage.unit + '/' +`daywiseEmployees/${dateStr}/${data.employeeId}/status`] = data.status;
  updates[localStorage.unit + '/' +`daywiseEmployees/${dateStr}/${data.employeeId}/statusTimestamp`] = timestamp;

  if (((data.status === 'RELEASE FOR DAY') || (data.status === 'ASSIGN')) && data.selectedZone) {
    const _id = data.selectedZone._id;
    if (_id) {
      updates[localStorage.unit + '/' +`liveZones/${dateStr}/${_id}/${employeeId}`] = null;
      updates[localStorage.unit + '/' +`daywiseZones/${dateStr}/${_id}/${employeeId}/releasedAt`] = timestamp;
    }
  }

  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}


export function updateAssignedZone(data) {
  const { employeeId, entryTimestamp, timestamp, status, selectedZone, name } = data;
  const dateStr = moment(entryTimestamp).format('DD-MM-YYYY');
  const historyRef = firebase.database().ref(localStorage.unit + '/' +`employees/${employeeId}/history/`);
  const arrKey = historyRef.push().key;

  const updates = {};
  updates[localStorage.unit + '/' +`employees/${employeeId}/history/${arrKey}`] = data;
  updates[localStorage.unit + '/' +`employees/${employeeId}/status`] = status;
  updates[localStorage.unit + '/' +`employees/${employeeId}/statusTimestamp`] = timestamp;
  updates[localStorage.unit + '/' +`employees/${employeeId}/selectedZone`] = selectedZone;
  updates[localStorage.unit + '/' +`daywiseEmployees/${dateStr}/${data.employeeId}/status`] = status;
  updates[localStorage.unit + '/' +`daywiseEmployees/${dateStr}/${data.employeeId}/statusTimestamp`] = timestamp;

  const { _id, name: areaName } = selectedZone;
  const employeeData = { employeeId, name, entryTimestamp, timestamp, areaName, areaId: _id };

  updates[localStorage.unit + '/' +`liveZones/${dateStr}/${_id}/${employeeId}`] = employeeData;
  updates[localStorage.unit + '/' +`daywiseZones/${dateStr}/${_id}/${employeeId}`] = employeeData;

  const dbRef = firebase.database().ref();
  return dbRef.update(updates);
}

export function uploadEmployeeImage(file, employeeId) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = localStorage.unit + '/' +'Employees/'+employeeId+'/'+epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(file, 'base64')
}
