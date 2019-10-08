import * as firebase from 'firebase';
import moment from 'moment';

const localStorage = window.localStorage;

export function saveMaterialIn(data) {
  const updates={};
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();

  const newData = Object.assign({}, data);
  if(data.materialStatus==='New') {
    let returnable = data.retNonret === 'Returnable' ? true : false;
  newData.returnable=returnable;
  newData.inDate=dateStr;
  newData.inTime=timeStr;

  updates[localStorage.unit + '/'+`materialReports/in/${dateStr}/${data.inwardSNo}`] = newData;
  updates[localStorage.unit + '/'+`materialBarcodes/${data.inwardSNo}`] = newData;
  }

  if(data.materialStatus==='Pending' && data.outDate && !data.inDate) {
    console.log('it should nt come here')
    updates[localStorage.unit + '/'+ `materialReports/out/${data.outDate}/${data.outwardSNo}/returnable`]=false;
    updates[localStorage.unit + '/'+ `materialReports/out/${data.outDate}/${data.outwardSNo}/inDate`]=dateStr;
    updates[localStorage.unit + '/'+ `materialReports/out/${data.outDate}/${data.outwardSNo}/inTime`]=timeStr;
    updates[localStorage.unit + '/'+ `materialReports/out/${data.outDate}/${data.outwardSNo}/inwardSNo`]=data.inwardSNo;
    updates[localStorage.unit + '/' + `materialBarcodes/${data.outwardSNo}/returnable`]=false;
    updates[localStorage.unit + '/' + `materialBarcodes/${data.outwardSNo}/inDate`]=dateStr;
    updates[localStorage.unit + '/' + `materialBarcodes/${data.outwardSNo}/inTime`]=timeStr;
    updates[localStorage.unit + '/' + `materialBarcodes/${data.outwardSNo}/inwardSNo`]=data.inwardSNo;
  }
  console.log(updates)

  return dbRef.update(updates);
}

export function saveMaterialOut(data) {
  const updates={};
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const timeStr = moment(date).format('h:mm A');
  const dbRef = firebase.database().ref();

  const newData=Object.assign({}, data);
  if(data.materialStatus==='New') {
    let returnable = data.retNonret === 'Returnable' ? true : false;

    newData.returnable=returnable;
    newData.outDate=dateStr;
    newData.outTime=timeStr;
    updates[localStorage.unit + '/'+`materialReports/out/${dateStr}/${data.outwardSNo}`] = newData;
    updates[localStorage.unit + '/'+`materialBarcodes/${data.outwardSNo}`] = newData;
  }
  console.log(data);
  if(data.inDate && !data.outDate) {
    updates[localStorage.unit + '/'+ `materialReports/in/${data.inDate}/${data.inwardSNo}/returnable`]=false;
    updates[localStorage.unit + '/'+ `materialReports/in/${data.inDate}/${data.inwardSNo}/outDate`]=dateStr;
    updates[localStorage.unit + '/'+ `materialReports/in/${data.inDate}/${data.inwardSNo}/outTime`]=timeStr;
    updates[localStorage.unit + '/'+ `materialReports/in/${data.inDate}/${data.inwardSNo}/outwardSNo`]=data.outwardSNo;
    updates[localStorage.unit + '/' + `materialBarcodes/${data.inwardSNo}/returnable`]=false;
    updates[localStorage.unit + '/' + `materialBarcodes/${data.inwardSNo}/outDate`]=dateStr;
    updates[localStorage.unit + '/' + `materialBarcodes/${data.inwardSNo}/outTime`]=timeStr;
    updates[localStorage.unit + '/' + `materialBarcodes/${data.inwardSNo}/outwardSNo`]=data.outwardSNo;
  }
  console.log(updates);
  return dbRef.update(updates);
}

export function fetchMaterialData(sNo) {
  const dbRef =firebase.database().ref(localStorage.unit + '/' + `materialBarcodes/${sNo}`);
  return dbRef.once('value');
}

export function fetchMaterialReportsData(report, unit) {
  const dbRef = firebase.database().ref(unit + '/' + `materialReports/${report}`);
  return dbRef.once('value');
}

export function getAllMaterials() {
  const dbRef = firebase.database().ref(localStorage.unit + '/' +'materialsForPrint');
  return dbRef.once('value');
}

export function uploadStoreMaterialImage(file, sNo) {
  const storageRef = firebase.storage().ref();
  let epochTime = new Date().getTime();
  const path = localStorage.unit + '/' +'Materials/'+sNo+'/'+epochTime+'.jpeg';
  const imgRef = storageRef.child(path);
  return  imgRef.putString(file, 'base64')
}

export function getMaterialsForPrint(barcode) {
  let mBarCode = barcode.toUpperCase();
  const dbRef = firebase.database().ref(localStorage.unit + '/' +`materialBarcodes/${mBarCode}`);
  return dbRef.once('value');
}
