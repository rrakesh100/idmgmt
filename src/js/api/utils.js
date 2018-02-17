import RequestWatcher from './request-watcher';
import Moment from 'moment';


let _headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export function headers() {
  return _headers;
}

export function parseJSON(response) {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response);
}

export function updateHeaders(newHeaders) {
  _headers = { ..._headers, newHeaders };
  Object.keys(_headers).forEach((key) => {
    if (undefined === _headers[key]) {
      delete _headers[key];
    }
  });
}

export function getTimeInterval(startTime, endTime) {
  const start = Moment(startTime, 'HH:mm');
  const end = Moment(endTime, 'HH:mm');
  const minutes = end.diff(start, 'minutes');
  const interval = Moment().hour(0).minute(minutes);
  return interval.format('HH:mm');
}

//export const requestWatcher = new RequestWatcher();
