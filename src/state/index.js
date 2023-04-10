import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import transactionsReducer from './transactions/reducer'
import walletReducer from './wallet/reducer'

const PERSISTED_KEYS = []

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  blacklist: [],
  storage,
  version: 1,
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    transactions: transactionsReducer,
    wallet: walletReducer,
  }),
)

let store

export function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
  }

  return _store
}

store = initializeStore()

export default store

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
