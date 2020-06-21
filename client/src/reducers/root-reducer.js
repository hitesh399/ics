import { combineReducers } from 'redux';
import { sidebarReducer } from './sidebar-reducer';
import { authReducer } from './auth-reducer';

export const rootReducer = combineReducers({
    sidebar: sidebarReducer,
    auth: authReducer,
});
