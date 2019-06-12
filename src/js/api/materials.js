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
  newData.inDate=dateStr;
  newData.inTime=timeStr;

  updates[localStorage.unit + '/'+`materialReports/in/${dateStr}/${data.inwardSNo}`] = newData;
  updates[localStorage.unit + '/'+`materialBarcodes/${data.inwardSNo}`] = newData;

  return dbRef.update(updates);
}

export function saveMaterialOut(data) {
  const updates={};
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();

  const newData=Object.assign({}, data);
  delete newData['retNonret'];

  if(data.inDate) {
    updates[localStorage.unit + '/'+ `materialReports/in/${data.inDate}/${data.inwardSNo}/returnable`]=false;
    updates[localStorage.unit + '/'+ `materialReports/in/${data.inDate}/${data.inwardSNo}/outDate`]=dateStr;
    updates[localStorage.unit + '/'+ `materialReports/in/${data.inDate}/${data.inwardSNo}/outTime`]=timeStr;
    updates[localStorage.unit + '/'+ `materialReports/in/${data.inDate}/${data.inwardSNo}/outwardSNo`]=data.outwardSNo;
  }

  updates[localStorage.unit + '/'+`materialReports/out/${dateStr}/${data.outwardSNo}`] = newData;

  return dbRef.update(updates);
}

export function fetchMaterialData(sNo) {
  const dbRef =firebase.database().ref(localStorage.unit + '/' + `materialBarcodes/${sNo}`);
  return dbRef.once('value');
}
