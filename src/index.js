import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Map from './components/map'


class App extends Component{
  render(){
      return(
        <div className="container-fluid">
          <Map />
        </div>
      );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
