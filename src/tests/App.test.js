import React from 'react';
import ReactDOM from 'react-dom';
import App from '../admin-panel/admin';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
