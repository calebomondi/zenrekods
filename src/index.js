import React from 'react';
import ReactDOM from 'react-dom/client';
//import { Test } from './components/test/test';
import App from './App';
//import FileViewer from './components/FileHandler/FileViewer';
//<Test fileUrl={'http://localhost:3001/view/test101/SCT221-0211-2021.pdf'}/>

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


