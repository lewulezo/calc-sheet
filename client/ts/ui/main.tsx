import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ConfigureUI from './ConfigureUI';


window.addEventListener('load', ()=>{
  ReactDOM.render((
    <ConfigureUI cfg={ConfigureUI.defaultCfg} />
  ), document.getElementById('content'));
});

