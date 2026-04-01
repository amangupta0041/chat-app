import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import messageReducer from "./messageSlice.js";
import socketReducer from "./socketSlice.js";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    // FIXED: Do not persist socket state, and blacklist message state 
    // to prevent cross-tab message contamination and deletion flashing.
    blacklist: ['socket', 'message'] 
}

const rootReducer = combineReducers({
    user: userReducer,
    message: messageReducer,
    socket: socketReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // FIXED: Adding 'socket/setSocket' to ignore the non-serializable error
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'socket/setSocket'],
                ignoredPaths: ['socket.socket'], 
            },
        }),
});

export default store;