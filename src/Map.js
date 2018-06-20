import React, { Component } from 'react';
import ListItems from './ListItems'
class Map extends Component {

	constructor(props){
		super(props)
		this.state={
			map: '',
			infowindow: '',
			prevmarker: '',
			allocations:[]
		}
		this.openInfoWindow = this.openInfoWindow.bind(this)
		this.closeInfoWindow = this.closeInfoWindow.bind(this)
	}

	componentDidMount(){
		window.initMap = this.initMap;

		loadMapJS('https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing&key=AIzaSyAepUQIprBToNYrHGFFKnyPk3lPh-XdwKg&v=3&callback=initMap')
	}	
	initMap=()=>{
		const largeInfoWindow = new window.google.maps.InfoWindow()
		const mapView = document.getElementById('map')
		let h = window.innerHeight
		h+=10
		mapView.style.height = 500 + 'px'
		var map = new window.google.maps.Map(mapView,{
			center:{lat:30.4637624,lng:78.0970646},
			zoom:15,
			mapTypeControl: false
		})

		let InfoWindow = new window.google.maps.InfoWindow({});

		window.google.maps.event.addListener(InfoWindow,'closeclick',()=>{
			this.closeInfoWindow();
		})

		this.setState({
			map:map,
			infowindow:InfoWindow
		})

		window.google.maps.event.addListener(map, 'click',()=> {
            this.closeInfoWindow();
		});



		this.props.locations.map(location=>{
			var marker = new window.google.maps.Marker({
				position: location.location,
				animation: window.google.maps.Animation.DROP,
				map:map

			})

			var infowindow = new window.google.maps.InfoWindow({
				content: location.title
			})

			marker.addListener('click', ()=>{
				this.openInfoWindow(marker,location.title)
				infowindow.open(map,marker)
				infowindow.close()
			})
		})
	}

	openInfoWindow=(marker,title)=>{
		this.closeInfoWindow();
		this.state.infowindow.open(this.state.map,marker)
		marker.setAnimation(window.google.maps.Animation.BOUNCE);
		this.setState({
			prevmarker: marker
		})
		this.state.infowindow.setContent(title)
		this.state.map.setCenter(marker.getPosition())
		this.state.map.panBy(0,-200)
	}

	closeInfoWindow=()=>{
		if (this.state.prevmarker) {
			this.state.prevmarker.setAnimation(null)
		}
		this.setState({
			prevmarker: ''
		})
		this.state.infowindow.close()
	}



   render() {

   return(
   			<div>
   				<div id="map">
   				</div>
   				<div style={{display:`none`}}>
   					<ListItems openWindow={this.openInfoWindow}/>
   				</div>
   			</div>
 	     
   		)

   }
}

export default Map;

function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}




