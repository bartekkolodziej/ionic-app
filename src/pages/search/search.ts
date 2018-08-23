import {Component, HostListener} from '@angular/core';
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
    {name: 'Cheese', keyword: 'convenience+store grocery', storeType: 'grocery_or_supermarket'},
    {name: 'Meat', keyword: 'convenience+store grocery', storeType: 'grocery_or_supermarket'},
    {name: 'Sweets', keyword: 'convenience+store grocery', storeType: 'grocery_or_supermarket'},
    {name: 'Mouthwash', keyword: 'pharmacy drug+store'},
    {name: 'Restaurant', keyword: 'restaurant', storeType: 'restaurant'},
    {name: 'Pancakes', keyword: 'pancakes'},
    {name: 'Waffles', keyword: 'waffles'},
    {name: 'Eggs', keyword: 'convenience+store grocery', storeType: 'grocery_or_supermarket'},
    {name: 'Ice Creams', keyword: 'ice+cream'},
    {name: 'Flowers', keyword: 'Florist'},
    {name: 'Cigarettes', keyword: 'convenience+store grocery', storeType: 'grocery_or_supermarket'},
    {name: 'Gas Oil', keyword: 'petrol+station'},
    {name: 'Petrol', keyword: 'petrol+station'},
    {name: 'Fuel', keyword: 'petrol+station'},
    {name: 'Bread', keyword: 'convenience+store grocery bakery', storeType: 'grocery_or_supermarket'},
    {name: 'Milk', keyword: 'convenience+store grocery', storeType: 'grocery_or_supermarket'},
    {name: 'Electrics', keyword: 'electronics'},
    {name: 'Bulb', keyword: 'electronics', poiType: 'electrician'},
    {name: 'Museum', keyword: 'museum'},
    {name: 'PS4', keyword: 'ps4'},
    {name: 'Xbox', keyword: 'xbox'},
    {name: 'Medicines', keyword: 'pharmacy'},
    {name: 'Housewares', keyword: 'housewares white+goods'},
    {name: 'Pet store', keyword: 'pet+store'},
    {name: 'Coca-cola', keyword: 'convenience+store grocery', storeType: 'grocery_or_supermarket'},
    {name: 'Beer', keyword: 'convenience+store grocery liquor+store'},
    {name: 'Toothbrush', keyword: 'drug+store pharmacy'},
    {name: 'Pizza', keyword: 'pizza'},
    {name: 'Tea', keyword: 'tea'},
    {name: 'Coffee', keyword: 'coffee', storeType: 'grocery_or_supermarket', poiType: 'cafe'},
    {name: 'Cosmetics', keyword: 'drug+store'},
    {name: 'Electrics', keyword: 'electrics'},
    {name: 'Chips', keyword: 'convenience+store grocery', storeType: 'grocery_or_supermarket'},
    {name: 'Car', keyword: 'car+dealer'},
  ];

  contentToShow = [];
  resultsCount = 1;
  resultsType = 'storeType';
  currentPosition = {lat: 0, lng: 0};
  isLocationEnabled = false; //To change
  settingsModal;
  addlistModal;
  deletelistModal;
  input;
  lists: {name: string, products: any[]}[];
  selectedList: string = '';
  listToShow;

  constructor(public navController: NavController, private geolocation: Geolocation, private diagnostic: Diagnostic) {
    JSON.parse(localStorage.getItem('lists')) === null ? this.lists = [{name:'', products:[]}] : this.lists = JSON.parse(localStorage.getItem('lists'));
    this.listToShow = this.lists.find(el => el.name === this.selectedList)
  }

  showSettings() {
    this.settingsModal.style.display = "block";
  }

  closeSettings() {
    this.settingsModal.style.display = "none";
  }

  showAddlistModal() {
    this.addlistModal.style.display = 'block'
  }

  closeAddlistModal(){
    this.addlistModal.style.display = "none";
  }

  showDeletelistModal() {
    this.deletelistModal.style.display = 'block'
  }

  closeDeletelistModal(){
    this.deletelistModal.style.display = "none";
  }

  ngOnInit(): void {
    this.settingsModal = document.getElementById('settingsModal');
    this.addlistModal = document.getElementById('addlistModal');
    this.deletelistModal = document.getElementById('deletelistModal');
    this.input = document.getElementsByTagName('input')[0];
    this.input.addEventListener('keyup', e => this.keyUpHandler(e));
    document.addEventListener('click', event => {
      if (event.target == this.settingsModal) this.settingsModal.style.display = "none";
      if (event.target == this.addlistModal) this.addlistModal.style.display = "none";
      if (event.target == this.deletelistModal) this.deletelistModal.style.display = "none";
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
          this.lists.find(el => el.name === this.selectedList).products.push(x);
          isFound = true;
          break;
        }
      }
      if (!isFound)
        this.lists.find(el => el.name === this.selectedList).products.push({name: event.target.value, keyword: event.target.value});

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
    this.lists.find(el => el.name === this.selectedList).products.push(element);
    this.input.value = '';
  }

  removeChosenElement(element) {
    this.lists.find(el => el.name === this.selectedList).products = this.lists.find(el => el.name === this.selectedList).products.filter(el => el !== element)
  }

  searchForPlaces() {
    this.closeSettings();
    this.navController.push(HomePage, {
      chosenElements: this.lists.find(el => el.name === this.selectedList).products,
      resultsCount: this.resultsCount,
      currentPosition: this.currentPosition,
      resultsType: this.resultsType
    });
  }

  addNewList(val) {
    this.lists.push({name:val, products:[]});
    this.selectedList = val;
    this.closeAddlistModal();
    this.listToShow = this.lists.find(el => el.name === this.selectedList);
  }

  deleteList() {
    this.lists = this.lists.filter(el => el.name !== this.selectedList);
    this.selectedList = '';
    this.closeDeletelistModal();
  }

  selectList(val) {
    if(val === '')

    this.selectedList = val;
    this.listToShow = this.lists.find(el => el.name === this.selectedList);
    console.log(this.lists)
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.lists.find(el => el.name === '').products = [];
    localStorage.setItem('lists', JSON.stringify(this.lists));
  }

}
