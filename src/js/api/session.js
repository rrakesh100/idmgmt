import { headers, parseJSON } from './utils';
import * as firebase from 'firebase';
import FireBaseTools from './firebase-tools';

export function postSession(email, password) {
let user = {
  email,
  password
}
 let promise = FireBaseTools.loginUser(user)
  return promise;
}

export function deleteSession(session) {
  const options = {
    headers: headers(),
    method: 'DELETE'
  };

  return fetch(session.uri, options)
    .then(parseJSON);
}
