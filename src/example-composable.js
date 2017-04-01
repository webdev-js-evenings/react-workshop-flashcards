import React from 'react';
import ReactDOM from 'react-dom';

const Praha = () => {
  return (
    <div>
      <h1>Praha</h1>
    </div>
  );
};

const Brno = () => {
  return (
    <div>
      <h2>Brno</h2>
    </div>
  );
};

ReactDOM.render(
  <div>
    <Praha />
    <Brno />
  </div>,
  document.getElementById('root'),
);
