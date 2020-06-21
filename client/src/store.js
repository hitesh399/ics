import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers/root-reducer';
import logger from 'redux-logger';

const middlewares = [thunk, logger];

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
