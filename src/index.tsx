import './assets/sass/global.scss';

import App from './app/index';
import {AuthProvider} from './contexts/AuthContext';
import React from 'react';
import ReactDOM from 'react-dom';

var element = document.createElement('div');
element.setAttribute('id', 'root');
element.setAttribute('class', 'container');
document.body.appendChild(element);

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider>,
    document.getElementById('root'));
