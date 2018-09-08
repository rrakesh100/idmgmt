import * as firebase from 'firebase';
import moment from 'moment';

const localStorage = window.localStorage;

export function saveAttendanceInData(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');

  const dbRef = firebase.database().ref();
  const updates = {};

  if(!data.selectedEmployeeId) {
    alert('Something really went wrong...Please try again..');
    return;
  }

  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/inwardPhoto`] = data.inwardPhoto;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/numberOfPersons`] = data.numberOfPersons;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/shift`] = data.shift;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/paymentType`] = data.paymentType;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/inDate`] = dateStr;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/inTime`] = timeStr;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/inSide`] = true;

  updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/in`] = timeStr;
  updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/name`] = data.selectedEmployeeName;
  updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/shift`] = data.shift;
  updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/paymentType`] = data.paymentType;
  updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/numberOfPersons`] = data.numberOfPersons;
  updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/inwardPhoto`] = data.inwardPhoto;

  updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${dateStr}/in`] = timeStr;
  updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${dateStr}/name`] = data.selectedEmployeeName;
  updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${dateStr}/shift`] = data.shift;
  updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${dateStr}/paymentType`] = data.paymentType;
  updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${dateStr}/numberOfPersons`] = data.numberOfPersons;
  updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${dateStr}/inwardPhoto`] = data.inwardPhoto;


  return dbRef.update(updates);
}

export function saveAttendanceOutData(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const yesterDateStr = moment().subtract('1', 'day').format('DD-MM-YYYY');


  const dbRef = firebase.database().ref();
  const updates = {};
  if(!data.selectedEmployeeId) {
    alert('Something really went wrong...Please try again..');
    return;
  }

  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/outwardPhoto`] = data.outwardPhoto;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/outDate`] = dateStr;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/outTime`] = timeStr;
  updates[localStorage.unit + '/' +`employees/${data.selectedEmployeeId}/inSide`] = false;

  if(data.shift === 'Night Shift') {
  updates[localStorage.unit + '/' +`attendance/dates/${yesterDateStr}/${data.selectedEmployeeId}/tomorrowsOutTime`] = timeStr;
  updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${yesterDateStr}/tomorrowsOutTime`] = timeStr;
  } else {
    updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/out`] = timeStr;
    updates[localStorage.unit + '/' +`attendance/dates/${dateStr}/${data.selectedEmployeeId}/outwardPhoto`] = data.outwardPhoto;
    updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${dateStr}/out`] = timeStr;
    updates[localStorage.unit + '/' +`attendance/employees/${data.selectedEmployeeId}/${dateStr}/outwardPhoto`] = data.outwardPhoto;
  }
  return dbRef.update(updates);
}

export function getAttendanceDetails(date) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`attendance/dates/${date}/`);
  return dbRef.once('value');
}

export function getEmployeeAttendanceDates(employeeId) {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`attendance/employees/${employeeId}`);
  return dbRef.once('value');
}

export function uploadAttendanceEmployeeImage(file, employeeId) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = localStorage.unit + '/' +'Attendance/employees/'+employeeId+'/'+epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(file, 'base64')
}
