import * as firebase from 'firebase';
import moment from 'moment';


export function saveAttendanceInData(employeeId) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('DD-MM-YYYY h:mm a');

  const dbRef = firebase.database().ref();
  const updates = {};

  updates[`attendance/dates/${dateStr}/${employeeId}/in`] = timeStr;
  updates[`attendance/employees/${employeeId}/${dateStr}/in`] = timeStr;
  return dbRef.update(updates);
}

export function saveAttendanceOutData(employeeId) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('DD-MM-YYYY h:mm a');

  const dbRef = firebase.database().ref();
  const updates = {};

  updates[`attendance/dates/${dateStr}/${employeeId}/out`] = timeStr;
  updates[`attendance/employees/${employeeId}/${dateStr}/out`] = timeStr;
  return dbRef.update(updates);
}
