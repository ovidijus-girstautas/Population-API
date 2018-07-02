import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";


import countriesReducer from './reducers/countriesReducer';
import populationReducer from './reducers/populationReducer';

const rootReducer = combineReducers({
    countries: countriesReducer,
    population: populationReducer
})


const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();

