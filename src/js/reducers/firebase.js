import FireBaseTools from '../api/firebase-tools';
import {
  LOGIN_WITH_PROVIDER_FIREBASE,
  REGISTER_FIREBASE_USER,
  LOGIN_FIREBASE_USER,
  FETCH_FIREBASE_USER,
  UPDATE_FIREBASE_USER,
  CHANGE_FIREBASE_USER_PASSWORD,
  FIREBASE_PASSWORD_RESET_EMAIL,
  LOGOUT_FIREBASE_USER,
} from '../actions';
import { createReducer } from './utils';

const initialState = {};

const handlers = {
  [FETCH_FIREBASE_USER]: (state, action) => loginWithProvider(action.provider),
  [LOGOUT_FIREBASE_USER]: (state, action) => logoutUser(action.user),
  [REGISTER_FIREBASE_USER]: (state, action) => registerUser(action.user),
  [LOGIN_FIREBASE_USER]: (state, action) => loginUser(action.user),
  [UPDATE_FIREBASE_USER]: (state, action) => updateUser(action.user),
  [CHANGE_FIREBASE_USER_PASSWORD]: (state, action) => changePassword(action.newPassword),
  [FIREBASE_PASSWORD_RESET_EMAIL]: (state, action) => resetPasswordEmail(action.email),
  [LOGIN_WITH_PROVIDER_FIREBASE]: (state, action) => loginWithProvider(action.provider)
};


function loginWithProvider(provider) {
  FireBaseTools.loginWithProvider(provider);
}

function registerUser(user) {
  FireBaseTools.registerUser(user);
}

function loginUser(user) {
  FireBaseTools.loginUser(user);
}

// function fetchUser() {
//   FireBaseTools.fetchUser();
// }

function updateUser(user) {
  FireBaseTools.updateUserProfile(user);
}

function changePassword(newPassword) {
  FireBaseTools.changePassword(newPassword);
}

function resetPasswordEmail(email) {
  FireBaseTools.resetPasswordEmail(email);
}

function logoutUser(user) {
  FireBaseTools.logoutUser(user);
}


export default createReducer(initialState, handlers);
