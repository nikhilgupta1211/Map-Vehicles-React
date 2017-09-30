import React, { Component } from 'react';

class Input extends Component{
    constructor(props){
        super(props);
        this.submit = this.submit.bind(this);
        this.state = { srcLong: 28.589768, srcLat: 77.057725, destLong: 28.670498, destLat: 77.12631699999997 }
    }
    render(){
        return(
            <section>
                <form onSubmit={this.submit}>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="srcLong">Source Longitude</label>
                            <input name="srcLong" 
                            className="form-control" 
                            value={this.state.srcLong} 
                            onChange={event => this.setState({srcLong: event.target.value})}/>
                        </div>
                        <div className="col-md-6 form-group">
                            <label htmlFor="srcLat">Source Latitude</label>
                            <input name="srcLat" 
                            className="form-control" 
                            value={this.state.srcLat} 
                            onChange={event => this.setState({srcLat: event.target.value})}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="destLong">Destination Longitude</label>
                            <input name="destLong" 
                            className="form-control" 
                            value={this.state.destLong} 
                            onChange={event => this.setState({destLong: event.target.value})}/>
                        </div>
                        <div className="col-md-6 form-group">
                            <label htmlFor="destLat">Destination Latitude</label>
                            <input name="destLat" 
                            className="form-control" 
                            value={this.state.destLat} 
                            onChange={event => this.setState({destLat: event.target.value})}/>
                        </div>
                    </div>
                    <button className="btn btn-primary">Submit</button>
                </form>    
            </section>
        );
    }

    submit(e){
        e.preventDefault();
        if(this.state.srcLong!=='' || this.state.destLong!==''){
            var cords = {
                srcLong: parseFloat(this.state.srcLong),
                srcLat: parseFloat(this.state.srcLat),
                destLong: parseFloat(this.state.destLong),
                destLat: parseFloat(this.state.destLat)
            };

            this.setState({});
            this.props.pSubmit(cords);
        }
    }
}

export default Input;