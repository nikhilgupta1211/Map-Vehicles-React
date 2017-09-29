import React, { Component } from 'react';
import Input from './input';

const google = window.google;
class Map extends Component {
  constructor(props) {
    super(props);
    this.pSubmit = this.pSubmit.bind(this);
    this.drawPath = this.drawPath.bind(this);
    this.state = { cords: [], centerLong: 28.589664, centerLat: 77.05742 }
  }

  componentDidMount() {
    this.renderMap();
  }

  renderMap(){
    this.map = new google.maps.Map(this.refs.map, {
          center: {lat: this.state.centerLong, lng: this.state.centerLat},
          zoom: 15
        });
  }

  addMarker(LatLng,title){
    var marker = new google.maps.Marker({
          position: LatLng,
          map: this.map,
          title: title,
        });
    return marker;
  }

  pSubmit(cords){
      this.setState({ cords: cords, centerLong: cords.srcLong, centerLat: cords.srcLat });
      this.map.panTo({lat: cords.srcLong, lng: cords.srcLat});

      var srcLatLng = {lat: cords.srcLong, lng: cords.srcLat};
      var destLatLng = {lat: cords.destLong, lng: cords.destLat};

      var srcMarker = this.addMarker(srcLatLng,'Origin');
      var destMarker = this.addMarker(destLatLng,'Destination');

      const DirectionsService = new google.maps.DirectionsService();
      DirectionsService.route({
        origin: srcLatLng,
        destination: destLatLng,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            this.drawPath(result);
            this.moveMarker(srcMarker,result.routes[0].overview_path)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });

  }

  drawPath(directions){
    var flightPlanCoordinates = directions.routes[0].overview_path;
         var flightPath = new google.maps.Polyline({
           path: flightPlanCoordinates,
           geodesic: true,
           strokeColor: '#323232',
           strokeOpacity: 1.0,
           strokeWeight: 4
         });

         flightPath.setMap(this.map);
  }

  moveMarker(marker, cords)
  {   
      var count = 0;
      window.setInterval(function() {
        count = (count + 1);
        marker.setPosition( cords[count] );
      }, 1000);
  }

  render(){
    return(
      <section>
        <Input pSubmit={this.pSubmit}/><br />
        <div ref="map" className="map">I should be a map.</div>
      </section>
    );
  }
}

export default Map;