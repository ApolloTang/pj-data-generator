import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';


import rdx_main from './reducers';
import Component_main from './components';


ReactDOM.render(
    <Provider store={createStore(rdx_main)}>
        <Component_main />
    </Provider>
    , document.getElementById('root')
);



