import * as firebase from 'firebase';


export function saveWorkPlace(workplace) {
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`workplaces/${workplace}/name`] = workplace;
  return dbRef.update(updates)
}

export function getWorkPlaces() {
  const dbRef = firebase.database().ref('workplaces');
  return dbRef.once('value');
}

export function saveEditedWorkPlace(data) {
  console.log(data);
  const dbRef = firebase.database().ref();
  const updates = {};
  updates[`workplaces/${data.editWorkPlaceId}/allocation/${data.shift}/male`] = data.numOfMale;
  updates[`workplaces/${data.editWorkPlaceId}/allocation/${data.shift}/female`] = data.numOfFemale;


  return dbRef.update(updates);
}
