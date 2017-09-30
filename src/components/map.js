import React, { Component } from 'react';
import Input from './input';

const google = window.google;
class Map extends Component {
  constructor(props) {
    super(props);
    this.pSubmit = this.pSubmit.bind(this);
    this.drawPath = this.drawPath.bind(this);
    this.moveMarker = this.moveMarker.bind(this);
    this.state = { cords: [], centerLong: 28.589664, centerLat: 77.05742 }
  }

  componentDidMount() {
    this.renderMap();
  }

  renderMap(){
    this.map = new google.maps.Map(this.refs.map, {
          center: {lat: this.state.centerLong, lng: this.state.centerLat},
          zoom: 14
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
    this.setState({ cords: cords, centerLong: cords.srcLong, centerLat: cords.srcLat });
    this.map.panTo({lat: cords.srcLong, lng: cords.srcLat});

    var srcLatLng = {lat: cords.srcLong, lng: cords.srcLat};
    var destLatLng = {lat: cords.destLong, lng: cords.destLat};

    var srcMarker = this.addMarker(srcLatLng,'Origin','A');
    var destMarker = this.addMarker(destLatLng,'Destination','B');

    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
      origin: srcLatLng,
      destination: destLatLng,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
          this.drawPath(result.routes[0].overview_path,this.map);
          this.moveMarker(result.routes[0].overview_path)
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }

  drawPath(cords,map){
    var flightPlanCoordinates = cords;
         var flightPath = new google.maps.Polyline({
           path: flightPlanCoordinates,
           geodesic: true,
           strokeColor: '#323232',
           strokeOpacity: 0.7,
           strokeWeight: 4
         });

         flightPath.setMap(map);
  }

  moveMarker(cords)
  {   
      var marker = this.addMarker(cords[0],'Vehicle','','markcar.png');
      var count = 0;
      var that = this;
      window.setInterval(function() {
        if (count>cords.length-2){
          return;
        }
        count = (count + 1);
        marker.setPosition( cords[count] );
        that.drawPath([cords[count-1],cords[count]],that.map);
        if(count%15===0)
          that.map.panTo({lat: cords[count].lat(), lng: cords[count].lng()});
      }, 100);
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