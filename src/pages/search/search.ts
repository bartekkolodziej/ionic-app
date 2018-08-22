import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {Geolocation} from '@ionic-native/geolocation';
import {Diagnostic} from '@ionic-native/diagnostic';


/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  content = [
    {name: 'Cheese', keyword: 'convenience+store grocery', type: 'grocery_or_supermarket'},
    {name: 'Meat', keyword: 'convenience+store grocery', type: 'grocery_or_supermarket'},
    {name: 'Sweets', keyword: 'convenience+store grocery', type: 'grocery_or_supermarket'},
    {name: 'Mouthwash', keyword: 'pharmay drugstore'},
    {name: 'Restaurant', keyword: 'restaurant', type: 'restaurant'},
    {name: 'Pancakes', keyword: 'pancakes'},
    {name: 'Waffles', keyword: 'waffles'},
    {name: 'Eggs', keyword: 'convenience+store grocery', type: 'grocery_or_supermarket'},
    {name: 'Ice Creams', keyword: 'ice+cream'},
    {name: 'Flowers', keyword: 'Florist'},
    {name: 'Cigarettes', keyword: 'convenience+store grocery', type: 'grocery_or_supermarket'},
    {name: 'Gas Oil', keyword: 'petrol+station'},
    {name: 'Petrol', keyword: 'petrol+station'},
    {name: 'Fuel', keyword: 'petrol+station'},
    {name: 'Bread', keyword: 'convenience+store grocery bakery', type: 'grocery_or_supermarket'},
    {name: 'Milk', keyword: 'convenience+store grocery', type: 'grocery_or_supermarket'},
    {name: 'Electrics', keyword: 'electronics'},
    {name: 'Bulb', keyword: 'electronics'},
    {name: 'Museum', keyword: 'museum'},
    {name: 'PS4', keyword: 'ps4'},
    {name: 'Xbox', keyword: 'xbox'},
    {name: 'Medicines', keyword: 'pharmacy'},
    {name: 'Housewares', keyword: 'housewares white+goods'},
    {name: 'Pet store', keyword: 'pet+store'},
    {name: 'Coca-cola', keyword: 'convenience+store grocery', type: 'grocery_or_supermarket'},
    {name: 'Beer', keyword: 'convenience+store grocery liquor+store'},
    {name: 'Toothbrush', keyword: 'drug+store pharmacy'},
    {name: 'Pizza', keyword: 'pizza'},
    {name: 'Tea', keyword: 'tea'},
    {name: 'Coffee', keyword: 'coffee'},
    {name: 'Cosmetics', keyword: 'drug+store'},
    {name: 'Electrics', keyword: 'electrics'},
    {name: 'Chips', keyword: 'convenience+store grocery', type: 'grocery_or_supermarket'},
    {name: 'Car', keyword: 'car+dealer'},
    {name: 'Powerbank', keyword: 'variety+store'}

  ];

  contentToShow = [];
  chosenElements = [];
  resultsCount = 1;
  currentPosition = {lat: 0, lng: 0};
  isLocationEnabled = false; //To change
  modal;
  input;

  constructor(public navController: NavController, private geolocation: Geolocation, private diagnostic: Diagnostic) {
  }

  showModal() {
    this.modal.style.display = "block";
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  ngOnInit(): void {
    this.modal = document.getElementsByClassName('modal')[0];
    this.input = document.getElementsByTagName('input')[0];
    this.input.addEventListener('keyup', e => this.keyUpHandler(e));
    document.addEventListener('click', event => {
      if (event.target == this.modal) this.modal.style.display = "none";
      this.toggleSuggestions(true)
    });


    this.getPosition();
    //this.diagnostic.isLocationEnabled().then(() => this.getPosition())
  }


  getPosition() {
    this.isLocationEnabled = true;
    this.geolocation.getCurrentPosition().then(el => {
      this.currentPosition.lat = el.coords.latitude;
      this.currentPosition.lng = el.coords.longitude;
    });
  }

  keyUpHandler(event) {
    if (event.keyCode === 13) {
      let isFound = false;
      for (let x of this.content) {
        if (x.name.search(new RegExp(event.target.value, 'i')) !== -1) {
          this.chosenElements.push(x);
          isFound = true;
          break;
        }
      }
      if (!isFound)
        this.chosenElements.push({name: event.target.value, keyword: event.target.value});

      this.input.value = '';
      this.toggleSuggestions();
    } else
      this.showSuggestions();
  }

  showSuggestions() {
    this.toggleSuggestions();
    this.contentToShow = this.content.filter(el => el.name.search(new RegExp(this.input.value, 'i')) !== -1);
  }

  toggleSuggestions(turnOff = false) {
    let suggestions = document.getElementById('suggestions');

    if (this.input.value === '' || turnOff === true)
      suggestions.style.display = 'none';
    else if (suggestions.style.display === 'none' && this.input.value !== '')
      suggestions.style.display = 'block'
  }

  chooseElement(element) {
    this.chosenElements.push(element);
    this.input.value = '';
  }

  removeChosenElement(element) {
    this.chosenElements = this.chosenElements.filter(el => el !== element)
  }

  searchForPlaces() {
    this.closeModal();
    this.navController.push(HomePage, {
      chosenElements: this.chosenElements,
      resultsCount: this.resultsCount,
      currentPosition: this.currentPosition
    });
  }

  setResultsCount(val) {
    this.resultsCount = val;
  }
}
