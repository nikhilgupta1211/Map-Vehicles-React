import React, { Component } from 'react';

const google = window.google;
class Map extends Component {
  constructor(props) {
    super(props);
    this.traceVehicle = this.traceVehicle.bind(this);
    this.subCords = this.subCords.bind(this);
    this.moveMarker = this.moveMarker.bind(this);
    this.state = { cords: [], centerLong: 28.589664, centerLat: 77.05742 }
  }

  componentDidMount() {
    this.renderMap();
  }

  renderMap(){
    this.map = new google.maps.Map(this.refs.map, {
          center: {lat: this.state.centerLong, lng: this.state.centerLat},
          zoom: 9
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

  traceVehicle(cords,color){
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
          this.drawPath(result.routes[0].overview_path,this.map,color);
          this.moveMarker(result.routes[0].overview_path,color)
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
           strokeOpacity: 0.5,
           strokeWeight: 4
         });

         flightPath.setMap(map);
  }

  moveMarker(cords,color)
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
        that.drawPath([cords[count-1],cords[count]],that.map,color);
      }, 100);
  }

  subCords(points,color){
    var cords = {
      srcLong: points[0],
      srcLat: points[1],
      destLong: points[2],
      destLat: points[3]
      };
    this.traceVehicle(cords,color);
  }

  render(){
    return(
      <section>
        <div ref="map" className="map">I should be a map.</div><br />
        <button 
        className="btn btn-primary btn_vehicle"
        onClick={() => this.subCords([27.1767,78.0081,28.4595,77.0266],'#0282c8')}>
        Vehicle 1
        </button>
        <button 
        className="btn btn-primary"
        onClick={() => this.subCords([29.3909,76.9635,27.8974,78.0880],'#e12525')}>
        Vehicle 2
        </button>
      </section>
    );
  }
}

export default Map;