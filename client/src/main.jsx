import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ScheduleProvider } from './context/ScheduleContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ScheduleProvider>
        <App />
      </ScheduleProvider>
    </AuthProvider>
  </React.StrictMode>
);
