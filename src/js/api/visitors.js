import * as firebase from 'firebase';
import moment from 'moment';

export function saveVisitor(data) {
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const dbRef = firebase.database().ref();


  const updates = {};
  updates[`visitors/${data.visitorId}`] = data;
  updates[`daywiseVisitors/${dateStr}/${data.visitorId}`] = data;
  return dbRef.update(updates);
}

export function getVisitor(visitorId) {
  const visitorPath = `visitors/${visitorId}`;
  return dbRef.once(visitorPath);
}
