import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {} from '@types/googlemaps';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Geolocation} from '@ionic-native/geolocation';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  @ViewChild('map') mapElement: any;

  map;
  placesService: google.maps.places.PlacesService;

  currentPosition = {lat: 0, lng: 0};
  currentPositionMarker: google.maps.Marker;

  markers: google.maps.Marker[] = [];
  numberOfCompletedRequests: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  chosenElements: { name: string, keyword: string, type: string }[] = [];
  places: { place: any, products: string }[];

  constructor(public navCtrl: NavController, private navParams: NavParams, private http: HttpClient, private geolocation: Geolocation) {
    this.places = [];
  }

  ngOnInit(): void {
    this.chosenElements = this.navParams.get('chosenElements');
    this.currentPosition = this.navParams.get('currentPosition');
    this.initMap();
    this.getPlacesAndMarkers();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: this.currentPosition,
      zoom: 16
    });
    console.log(this.currentPosition);

    this.geolocation.watchPosition().subscribe(data => {
      console.log(this.currentPosition);
      this.currentPosition.lat = data.coords.latitude;
      this.currentPosition.lng = data.coords.longitude;
      this.currentPositionMarker.setPosition(this.currentPosition);
    });
  }

  getPlacesAndMarkers() {
    //init places service
    this.placesService = new google.maps.places.PlacesService(this.map);

    this.searchForPlaces(this.navParams.get('resultsCount'));

    //set custom pos marker and open its info window
    this.currentPositionMarker = new google.maps.Marker({position: this.currentPosition, map: this.map});
    let infoWindow = new google.maps.InfoWindow({content: 'Here you are'});
    this.currentPositionMarker.addListener('click', () => infoWindow.open(this.map, this.currentPositionMarker));
    infoWindow.open(this.map, this.currentPositionMarker);
    this.currentPositionMarker.setMap(this.map);

    //subscribe to number to check if can update markers
    this.numberOfCompletedRequests.subscribe(val => {
      if (val === this.navParams.get('chosenElements').length)
        this.putMarkersOnMap();
    })
  }

  searchForPlaces(resultsCount = 1) {
    let numberOfFoundElements = 0;
    //search by type, if didnt found all places search by keyword
    for (let x of this.chosenElements) {
      if (x.type) {
        this.placesService.nearbySearch({
          location: this.currentPosition,
          rankBy: google.maps.places.RankBy.DISTANCE,
          type: x.type
        }, (res, status) => {
          console.log(res)
          let tmp = res.slice(0, resultsCount);
          numberOfFoundElements = tmp.length;
          this.updatePlaces(tmp, x);
        });
      }

      if (resultsCount - numberOfFoundElements === 0)
        return;

      this.placesService.nearbySearch({
        location: this.currentPosition,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: x.keyword
      }, (res, status) => {
        let tmp = res.slice(0, resultsCount - numberOfFoundElements);
        this.updatePlaces(tmp, x);
        this.numberOfCompletedRequests.next(this.numberOfCompletedRequests.getValue() + 1);
      });
    }
  }

  allPlacesNearby() {
    this.http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDf2Khi4ZJabH0DUR6bfe1S7kjeBm6rhYw&location=50.073391,20.002397&radius=50`)
      .subscribe(res => console.log(res));
  }

  updatePlaces(slicedResponse, chosenEl) {
    for (let y of slicedResponse) {
      let flag = false;
      for (let z of this.places) {
        if (y.place_id === z.place.place_id) {
          flag = true;
          if (!z.products.includes(chosenEl.name))
            z.products += ' ' + chosenEl.name;
          break;
        }
      }
      if (flag === false)
        this.places.push({place: y, products: chosenEl.name})
    }
  }

  renderPath() {
    let directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionsDisplay.setMap(this.map);

    new google.maps.DirectionsService().route({
      origin: this.currentPosition,
      destination: this.places.length > 1 ? this.places[this.places.length - 1].place.geometry.location : this.places[0].place.geometry.location,
      waypoints: this.places.length > 2 ? this.places.slice(0, this.places.length - 1).map(el => {
        return {location: el.place.geometry.location, stopover: true}
      }) : [],
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    }, res => directionsDisplay.setDirections(res));
  }


  putMarkersOnMap() {
    for (let x of this.places) {
      let marker = new google.maps.Marker({
        position: x.place.geometry.location,
        map: this.map,
        animation: google.maps.Animation.DROP
      });
      let open = ''
      if (x.place.opening_hours)
        x.place.opening_hours.open_now === true ? open = 'Open now' : open = 'Closed now';

      let content = `<span style="display:block; padding:2px"><b>${x.place.name}</b></span>
                    <span style="display: block; padding: 2px">${x.place.vicinity}</span>
                    <span style="display: block; padding: 2px">${open}</span>
                    <span style="display:block; padding:2px">Here you can get: ${x.products}<span>`
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      marker.addListener('click', () => infoWindow.open(this.map, marker));
      this.markers.push(marker)
    }
    this.setMarkers(this.map)
    this.scaleMap();
  }

  setMarkers(map) {
    for (let x of this.markers)
      x.setMap(map);
  }

  scaleMap() {
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < this.markers.length; i++) {
      bounds.extend(this.markers[i].getPosition());
    }
    bounds.extend(this.currentPositionMarker.getPosition());
    this.map.fitBounds(bounds);
  }

  clearMap() {
    for (let x of this.markers)
      x.setMap(null);
    this.markers = [];
    this.places = [];
  }

}
