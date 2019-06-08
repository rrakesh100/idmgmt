import * as firebase from 'firebase';
import moment from 'moment';

const localStorage = window.localStorage;

export function saveMaterialIn(data) {
  const updates={};
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();
  let returnable;
  if(data.retNonret === 'Returnable') {
    returnable=true;
  } else {
    returnable=false;
  }

  const newData = Object.assign({}, data)
  newData.returnable=returnable;

  updates[localStorage.unit + '/'+`materialReports/in/${dateStr}/${data.inwardSNo}`] = newData;

  return dbRef.update(updates);
}

export function saveMaterialOut(data) {
  const updates={};
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();
  let returnable;
  if(data.retNonret === 'Returnable') {
    returnable=true;
  } else {
    returnable=false;
  }

  const newData = Object.assign({}, data)
  newData.returnable=returnable;

  updates[localStorage.unit + '/'+`materialReports/in/${dateStr}/${data.outwardSNo}`] = newData;

  return dbRef.update(updates);
}
