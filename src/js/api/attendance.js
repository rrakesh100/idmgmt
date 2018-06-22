import * as firebase from 'firebase';
import moment from 'moment';


export function saveAttendanceInData(employeeId, employeeName) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');

  const dbRef = firebase.database().ref();
  const updates = {};

  updates[`attendance/dates/${dateStr}/${employeeId}/in`] = timeStr;
  updates[`attendance/dates/${dateStr}/${employeeId}/name`] = employeeName;
  updates[`attendance/employees/${employeeId}/${dateStr}/in`] = timeStr;
  updates[`attendance/employees/${employeeId}/${dateStr}/name`] = employeeName;

  return dbRef.update(updates);
}

export function saveAttendanceOutData(employeeId, employeeName) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');

  const dbRef = firebase.database().ref();
  const updates = {};

  updates[`attendance/dates/${dateStr}/${employeeId}/out`] = timeStr;
  updates[`attendance/dates/${dateStr}/${employeeId}/name`] = employeeName;
  updates[`attendance/employees/${employeeId}/${dateStr}/out`] = timeStr;
  updates[`attendance/employees/${employeeId}/${dateStr}/name`] = employeeName;

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
