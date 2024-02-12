import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './Redux-Actions/user'
import routesReducer from './Redux-Actions/routes'
import storageSession from 'redux-persist/lib/storage/session'
import { persistReducer, persistStore } from 'redux-persist';

const rootPersistConfig = {
  key: 'root',
  storage:storageSession,
}
const rootReducer = combineReducers({
  user:userReducer,
  routes:routesReducer,
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)