import { combineReducers, compose, legacy_createStore as createStore } from "redux"

import { boardReducer } from './reducers/board.reducer.js'
import { userReducer } from './reducers/user.reducer.js'
import { systemReducer } from './reducers/system.reducer.js'

const rootReducer = combineReducers({
    boardModule: boardReducer,
    userModule: userReducer,
    systemModule: systemReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers())




