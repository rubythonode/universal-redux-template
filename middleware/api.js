import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import superAgent from 'superagent';
import Promise from 'bluebird';

export const CALL_API = Symbol('CALL_API');
// called from middleware and `fetchData`
export function createRequest ({ getState, next, request }) {
  let deferred = Promise.defer();
  // handle 401 and auth here
  let { method, url, successType } = request;
  superAgent[method](url)
    .end((err, res)=> {
      next({
        type: successType,
        response: res.body
      });
      deferred.resolve();
    });

  return deferred.promise;
}

export default store => next => action => {
  if ( ! action[CALL_API] ) {
    return next(action);
  }
  let apiAction = action[CALL_API];
  let { request } = apiAction;
  let { getState } = store;

  createRequest({ getState, next, request });
};
