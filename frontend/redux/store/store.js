import { combineReducers, configureStore } from "@reduxjs/toolkit";
 import usereducers from "../reducers/userSlice"
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import {FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER} from 'redux-persist'


const allreducers=combineReducers({ users:usereducers})
const persistConfig = {
  key: 'root',
  storage,
}

const pers = persistReducer(persistConfig, allreducers)
export default  configureStore({
    reducer: pers,
    devTools:false,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  
        
  });