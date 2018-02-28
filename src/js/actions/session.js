import { SESSION_LOAD, SESSION_LOGIN, SESSION_LOGOUT } from '../actions';
import { deleteSession, postSession } from '../api/session';
import { updateHeaders } from '../api/utils';

const localStorage = window.localStorage;

export function initialize() {
  return (dispatch) => {
    const { email, name, token } = localStorage;
    if (email && token) {
      dispatch({
        type: SESSION_LOAD, payload: { email, name, token }
      });
    } else {
      window.location = '/login';
    }
  };
}

// export function login(email, password, done) {
//   return dispatch => (
//     postSession(email, password)
//       .then((payload) => {
//         // updateHeaders({ Auth: payload.token });
//         // dispatch({ type: SESSION_LOGIN, payload });
//         console.log(payload);
//         try {
//           localStorage.email = payload.email;
//           localStorage.name = payload.displayName;
//           localStorage.token = payload.uid;
//         } catch (e) {
//           alert(
//             'Unable to preserve session, probably due to being in private ' +
//             'browsing mode.'
//           );
//         }
//         done();
//       })
//       .catch((e) => console.log('error occured while logging in' + e))
//   );
// }


export function loginUser(email, password) {
  return postSession(email, password);
}

export function logout(session) {
  return (dispatch) => {
    dispatch({ type: SESSION_LOGOUT });
    deleteSession(session);
    updateHeaders({ Auth: undefined });
    try {
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('token');

      let arr=[];

      for (var i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).substring(0,8) == 'firebase') {
            arr.push(localStorage.key(i));
        }
      }

      // Iterate over arr and remove the items by key
      for (var i = 0; i < arr.length; i++) {
          localStorage.removeItem(arr[i]);
      }
    } catch (e) {
      // ignore
    }
    window.location.href = '/login'; // reload fully
  };
}
