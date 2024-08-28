import React from 'react'
import { Provider } from "react-redux"
import store from './store/store'

import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore';

let persistor = persistStore(store)

function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default Providers
