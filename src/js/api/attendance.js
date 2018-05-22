import * as firebase from 'firebase';
import moment from 'moment';


export function saveAttendanceData(employeeId) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref();
  const updates = {};

  updates[`attendance/dates/${dateStr}/${employeeId}`] = 'true';
  updates[`attendance/employees/${employeeId}/${dateStr}`] = 'true';
  return dbRef.update(updates);
}
