import React, { Component } from 'react';

const google = window.google;

class Input extends Component{
  constructor(props) {
    super(props);
    
    this.submit = this.submit.bind(this);    
  }

  componentDidMount() {
    var input = document.getElementsByClassName('form-control');
    for (var i = 0; i < input.length; i++) {
        new google.maps.places.SearchBox(input[i]);
    }
  }
  render(){
    return(
      <section>
        <form onSubmit={this.submit}>
          <div className="form-group">
            <label htmlFor="origin">Origin</label>
            <input name="origin" 
            className="form-control" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input name="destination" 
            className="form-control" 
            />
          </div>
          <button className="btn btn-primary btn-block">Submit</button>
        </form>    
      </section>
    );
  }

  submit(e){
    e.preventDefault();
    var origin = document.getElementsByName('origin')[0].value;
    var destination = document.getElementsByName('destination')[0].value;
    if(origin!=="" && destination!==""){
      var geocoder = new google.maps.Geocoder();
      var values = [];
      var that = this;
      geocoder.geocode({address: origin}, function(results, status) {
        values.push([origin,results[0].geometry.location]);
        geocoder.geocode({address: destination}, function(results, status) {
            values.push([destination,results[0].geometry.location]);
            that.props.pSubmit(values);
        });
      });
      document.getElementsByName('origin')[0].value='';
      document.getElementsByName('destination')[0].value='';
    }
  }
}

export default Input;