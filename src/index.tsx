import React from 'react';
import ReactDOM from 'react-dom';
import 'src/scss/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

/*
function toCamelCase(inputString) {
  // Convert camelCase or PascalCase to underscore-separated
  let underscoreSeparated = inputString.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

  // Now convert the underscore-separated string to camelCase
  return underscoreSeparated.replace(/(?:^|[_\-\s]+)(\w)/g, (match, chr, index) => {
    console.log(match, chr, index)
      return index === 0 ? chr.toLowerCase() : chr.toUpperCase();
  }).replace(/[_\-\s]/g, ''); // Remove any leftover underscores, hyphens, or spaces
}*/


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
  
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
