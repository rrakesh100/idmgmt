import * as firebase from 'firebase';
import moment from 'moment';


export function saveAttendanceInData(data) {
  console.log(data)
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');

  const dbRef = firebase.database().ref();
  const updates = {};

  updates[`employees/${data.selectedEmployeeId}/inwardPhoto`] = data.inwardPhoto;
  updates[`employees/${data.selectedEmployeeId}/numberOfPersons`] = data.numberOfPersons;
  updates[`employees/${data.selectedEmployeeId}/shift`] = data.shift;
  updates[`employees/${data.selectedEmployeeId}/paymentType`] = data.paymentType;
  updates[`employees/${data.selectedEmployeeId}/inDate`] = dateStr;
  updates[`employees/${data.selectedEmployeeId}/inTime`] = timeStr;
  updates[`employees/${data.selectedEmployeeId}/inSide`] = true;

  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/in`] = timeStr;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/name`] = data.selectedEmployeeName;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/shift`] = data.shift;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/paymentType`] = data.paymentType;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/numberOfPersons`] = data.numberOfPersons;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/inwardPhoto`] = data.inwardPhoto;

  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/in`] = timeStr;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/name`] = data.selectedEmployeeName;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/shift`] = data.shift;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/paymentType`] = data.paymentType;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/numberOfPersons`] = data.numberOfPersons;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/inwardPhoto`] = data.inwardPhoto;


  return dbRef.update(updates);
}

export function saveAttendanceOutData(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const yesterDateStr = moment().subtract('1', 'day').format('DD-MM-YYYY');


  const dbRef = firebase.database().ref();
  const updates = {};

  updates[`employees/${data.selectedEmployeeId}/outwardPhoto`] = data.outwardPhoto;
  updates[`employees/${data.selectedEmployeeId}/outDate`] = dateStr;
  updates[`employees/${data.selectedEmployeeId}/outTime`] = timeStr;
  updates[`employees/${data.selectedEmployeeId}/inSide`] = false;

  if(data.shift === 'Night') {
  updates[`attendance/dates/${yesterDateStr}/${data.selectedEmployeeId}/tomorrowsOutTime`] = timeStr;
  updates[`attendance/employees/${data.selectedEmployeeId}/${yesterDateStr}/tomorrowsOutTime`] = timeStr;
  } else {
    updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/out`] = timeStr;
    updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/outwardPhoto`] = data.outwardPhoto;
    updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/out`] = timeStr;
    updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/outwardPhoto`] = data.outwardPhoto;
  }
  return dbRef.update(updates);
}

export function getAttendanceDetails(date) {
  const dbRef = firebase.database().ref(`attendance/dates/${date}/`);
  return dbRef.once('value');
}

export function getEmployeeAttendanceDates(employeeId) {
  const dbRef = firebase.database().ref(`attendance/employees/${employeeId}`);
  return dbRef.once('value');
}

export function uploadAttendanceEmployeeImage(file, employeeId) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = 'Attendance/employees/'+employeeId+'/'+epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(file, 'base64')
}
