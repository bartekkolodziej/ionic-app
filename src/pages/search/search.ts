import {Component, HostListener} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {Geolocation} from '@ionic-native/geolocation';
import {Diagnostic} from '@ionic-native/diagnostic';
import {Storage} from '@ionic/storage';
import {ProductDetailsPage} from "../product-details/product-details";


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
  lists: { name: string, products: any[] }[] = [];
  selectedList: string = 'Default'; //only for displaying, it may be deleted later
  activeProducts = [];
  inactiveProducts = [];

  constructor(public navController: NavController,
              private geolocation: Geolocation,
              private diagnostic: Diagnostic,
              private storage: Storage,
              public modalCtrl: ModalController
  ) {
    this.storage.get('lists').then(val => {
      if (val !== null)
        this.lists = val;
      this.lists.push({name: 'Default', products: []});
      this.activeProducts = this.lists.find(el => el.name === 'Default').products
    });
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

  showProductDetailsModal(el, note, price) {
    let modal = this.modalCtrl.create(ProductDetailsPage, {
      name: el.name,
      note: note ? note : '',
      price: price ? price : ''
    });
    modal.onDidDismiss(data => {
      if (data) {
        console.log(this.activeProducts)
        let product = this.activeProducts.find(el => el.name === data.name);
        product.note = data.note;
        product.price = data.price;
      }
    });
    modal.present();
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
        this.lists.find(el => el.name === this.selectedList).products.push({
          name: event.target.value,
          keyword: event.target.value
        });

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
    this.lists.push({name: val, products: []});
    this.selectedList = val;
    this.closeAddlistModal();
    this.activeProducts = this.lists.find(el => el.name === this.selectedList).products;
  }

  deleteList() {
    this.lists = this.lists.filter(el => el.name !== this.selectedList);
    this.selectedList = 'Default';
    this.closeDeletelistModal();
  }

  selectList(val) {
    this.selectedList = val;
    this.activeProducts = this.lists.find(el => el.name === this.selectedList).products;
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

  closeAddlistModal() {
    this.addlistModal.style.display = "none";
  }

  showDeletelistModal() {
    this.deletelistModal.style.display = 'block'
  }

  closeDeletelistModal() {
    this.deletelistModal.style.display = "none";
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    this.lists = this.lists.filter(el => el.name !== 'Default');
    this.storage.set('lists', this.lists);
  }


  setState(event, name) {
    if (event.target.checked === true) {
      for (let i = 0; i < this.activeProducts.length; i++) {
        if (this.activeProducts[i].name === name) {
          this.inactiveProducts.push(this.activeProducts[i]);
          this.activeProducts.splice(i, 1);
          break;
        }
      }
    } else {
      for (let i = 0; i < this.inactiveProducts.length; i++) {
        if (this.inactiveProducts[i].name === name) {
          this.activeProducts.push(this.inactiveProducts[i]);
          this.inactiveProducts.splice(i, 1);
          break;
        }
      }
    }
  }

}
