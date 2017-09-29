import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Map from './components/map'


class App extends Component{
  render(){
      return(
          <div className="container">
              <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                  <a className="navbar-brand" href="#">Map My Vehicle</a>
              </nav>
              <br />
              <Map />
          </div>
      );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
