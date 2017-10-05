import React, { Component } from 'react';
import Input from './input';
var randomColor = require('randomcolor');

const google = window.google;

class Map extends Component {
  constructor(props) {
    super(props);
    this.pSubmit = this.pSubmit.bind(this);
    this.drawPath = this.drawPath.bind(this);
    this.moveMarker = this.moveMarker.bind(this);
    this.panMap = this.panMap.bind(this);
    this.state = { center: {lat: 28.589664, lng: 77.05742}, vehicles: [], id: -1, colors: [], card: 0, markers: []}
  }

  componentDidMount() {
    this.renderMap();
  }

  renderMap(){
    this.map = new google.maps.Map(this.refs.map, {
      center: this.state.center,
      zoom: 11
    });
  }

  addMarker(LatLng,title,label,icon){
    var marker = new google.maps.Marker({
      position: LatLng,
      map: this.map,
      title: title,
      label: label,
      icon: icon
    });
    return marker;
  }

  pSubmit(cords){
    this.map.panTo(cords[0][1]);

    this.setState((prevState) => ({
      vehicles: prevState.vehicles.concat([cords]),
      center: cords[0][1],
      id: prevState.id+1,
      colors: prevState.colors.concat(randomColor({luminosity: 'dark'})),
      card: prevState.id+1
    }));

    var srcLatLng = cords[0][1];
    var destLatLng = cords[1][1];

    this.addMarker(srcLatLng,'Origin','A');
    this.addMarker(destLatLng,'Destination','B');

    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
      origin: srcLatLng,
      destination: destLatLng,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
          this.drawPath(result.routes[0].overview_path,this.map,this.state.colors[this.state.id]);
          this.moveMarker(result.routes[0].overview_path,this.state.id)
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }

  drawPath(cords,map,color){
    var flightPlanCoordinates = cords;
    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.6,
      strokeWeight: 5
    });

    flightPath.setMap(map);
  }

  moveMarker(cords,id){   
    var marker = this.addMarker(cords[0],'Vehicle','','markcar.png');
    this.setState((prevState) => ({
      markers: prevState.markers.concat([marker]),
    }));
    var count = 0;
    var that = this;
    window.setInterval(function() {
      if (count>cords.length-2){
        return;
      }
      count = (count + 1);
      marker.setPosition( cords[count] );
      that.state.markers[id] = cords[count];
      that.drawPath([cords[count-1],cords[count]],that.map,that.state.colors[id]);
    }, 100);
  }

  panMap(vehicle,index){
    this.map.panTo(this.state.markers[index]);
    this.setState({card: index});
  }

  render(){
    return(
      <div className="row">
        <div className="col-md-8 mapcont">
          <div ref="map" className="map"></div><br />
        </div>
        <div className="col-md-4">
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <a className="navbar-brand" href="#">Map Vehicles</a>
          </nav><br />
          <div className="alert alert-secondary" role="alert">
            *Add a vehicle navigation on the map by submitting the source and destincation addresses.<br />
            *Click on the Vehilce Button for information of that vehicle and to locate its current position on the map.
          </div>
          <Input pSubmit={this.pSubmit}/><br />
          <div>
            {this.state.vehicles.map((item,index) =>(
                  <button key={index+1} 
                  type="button" 
                  className="btn btn-marg"
                  style={{backgroundColor: this.state.colors[index]}}
                  onClick={event => this.panMap(item,index) }>Vehicle {index+1}</button>
              ))}
          </div><br />
          {this.state.vehicles.length!==0 &&
            <div className="card text-white mb-3" style={{backgroundColor: this.state.colors[this.state.card]}}>
              <div className="card-header">Vehicle {this.state.card + 1}</div>
              <div className="card-body" style={{color: 'white'}}>
                <h5 className="card-text"><b>Origin:</b> {this.state.vehicles[this.state.card][0][0]}</h5>
                <h5 className="card-text"><b>Destination:</b> {this.state.vehicles[this.state.card][1][0]}</h5>
              </div>
            </div>
          }
        </div>
      </div>  
    );
  }
}

export default Map;