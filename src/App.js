import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const App = ({ className }) => {
  return (
    <div className={`moje-trida ${className}`}>
      Testing
    </div>
  );
};

App.defaultProps = {
  className: '',
};

export default App;
