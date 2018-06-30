import * as firebase from 'firebase';
import moment from 'moment';


export function saveAttendanceInData(data) {
  console.log(data)
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');

  const dbRef = firebase.database().ref();
  const updates = {};

  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/in`] = timeStr;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/name`] = data.selectedEmployeeName;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/shift`] = data.shift;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/numberOfPersons`] = data.numberOfPersons;
  updates[`attendance/dates/${dateStr}/${data.selectedEmployeeId}/screenshot`] = data.screenshot;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/in`] = timeStr;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/name`] = data.selectedEmployeeName;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/shift`] = data.shift;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/numberOfPersons`] = data.numberOfPersons;
  updates[`attendance/employees/${data.selectedEmployeeId}/${dateStr}/screenshot`] = data.screenshot;


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
