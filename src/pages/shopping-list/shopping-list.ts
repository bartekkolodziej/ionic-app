import {Component, HostListener} from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {MapPage} from "../map/map";
import {Geolocation} from '@ionic-native/geolocation';
import {Diagnostic} from '@ionic-native/diagnostic';
import {Storage} from '@ionic/storage';
import {ProductDetailsPage} from "../product-details/product-details";
import {SettingsPage} from "../settings/settings";


@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  // contentToShow = [];
  resultsCount = 1;
  resultsType = 'storeType';
  currentPosition = {lat: 0, lng: 0};
  isLocationEnabled = false; //To change
  addlistModal;
  clearListModal;
  // searchInput;
  lists: { name: string, activeProducts: any[], inactiveProducts: any[] }[] = [];
  selectedList: string = 'Default'; //only for displaying, it may be deleted later
  activeProducts = [];
  inactiveProducts = [];
  currentCost = 0;

  constructor(public navController: NavController,
              private geolocation: Geolocation,
              private diagnostic: Diagnostic,
              private storage: Storage,
              public modalCtrl: ModalController
  ) {
    this.storage.get('lists').then(val => {
      if (val !== null)
        this.lists = val;
      this.lists.push({name: 'Default', activeProducts: [], inactiveProducts: []});
      this.activeProducts = this.lists.find(el => el.name === 'Default').activeProducts
      this.inactiveProducts = this.lists.find(el => el.name === 'Default').inactiveProducts
    });
  }

  ngOnInit(): void {
    this.addlistModal = document.getElementById('addlistModal');
    this.clearListModal = document.getElementById('clearListModal');
    // this.searchInput = document.getElementById('searchInput');
    // this.searchInput.addEventListener('keyup', e => this.keyUpHandler(e));
    document.addEventListener('click', event => {
      if (event.target == this.addlistModal) this.addlistModal.style.display = "none";
      if (event.target == this.clearListModal) this.clearListModal.style.display = "none";
      // this.toggleSuggestions(true)
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

  // keyUpHandler(event) {
  //   if (event.keyCode === 13) {
  //     let isFound = false;
  //     for (let x of this.content) {
  //       if (x.name.search(new RegExp(event.target.value, 'i')) !== -1) {
  //         this.chooseElement(x);
  //         isFound = true;
  //         break;
  //       }
  //     }
  //     if (!isFound)
  //       this.chooseElement({
  //         name: event.target.value,
  //         keyword: event.target.value
  //       });
  //
  //     this.searchInput.value = '';
  //     this.toggleSuggestions();
  //   } else
  //     this.showSuggestions();
  // }

  addElement(element) {
    this.lists.find(el => el.name === this.selectedList).activeProducts.push(element);
    this.calcCurrentCost();
    // this.searchInput.value = '';
  }

  removeChosenElement(element) {
    this.lists
      .find(el => el.name === this.selectedList).activeProducts = this.lists
      .find(el => el.name === this.selectedList).activeProducts
      .filter(el => el !== element)
  }

  searchForPlaces() {
    this.navController.push(MapPage, {
      chosenElements: this.lists.find(el => el.name === this.selectedList).activeProducts,
      resultsCount: this.resultsCount,
      currentPosition: this.currentPosition,
      resultsType: this.resultsType
    });
  }

  addNewList(val) {
    this.lists.push({name: val, activeProducts: [], inactiveProducts: []});
    this.selectedList = val;
    this.closeAddlistModal();
    this.activeProducts = this.lists.find(el => el.name === this.selectedList).activeProducts;
    this.inactiveProducts = this.lists.find(el => el.name === this.selectedList).inactiveProducts;
  }

  deleteList() {
    this.lists = this.lists.filter(el => el.name !== this.selectedList);
    this.selectedList = 'Default';
    this.activeProducts = this.lists.find(el => el.name === this.selectedList).activeProducts;
    this.inactiveProducts = this.lists.find(el => el.name === this.selectedList).inactiveProducts;
  }

  clearList(){
    this.activeProducts = this.lists.find(el => el.name === this.selectedList).activeProducts = [];
    this.inactiveProducts = this.lists.find(el => el.name === this.selectedList).inactiveProducts = [];
    this.closeClearListModal();
  }

  selectList(val) {
    this.selectedList = val;
    this.activeProducts = this.lists.find(el => el.name === this.selectedList).activeProducts;
    this.inactiveProducts = this.lists.find(el => el.name === this.selectedList).inactiveProducts;
  }

  setProductState(event, name) {
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
    this.calcCurrentCost();
  }

  calcCurrentCost(){
    if(this.activeProducts.length === 0)
      return this.currentCost = 0;
    if(this.activeProducts.length === 1)
      return this.activeProducts[0].price ? this.currentCost = this.activeProducts[0].price : this.currentCost = 0;

    this.currentCost = this.activeProducts.reduce((a, b) => {
      if(!b.price) b.price = 0;
      return a + Number(b.price);
    }, 0);
  }

  showProductDetailsModal(name, note, price, keyword, mode) {
    let modal = this.modalCtrl.create(ProductDetailsPage, {
      name: name ? name : '',
      note: note ? note : '',
      price: price ? price : '',
      keyword: keyword ? keyword : '',
      mode: mode
    });
    modal.onDidDismiss(data => {
      if (data && data.mode === 'edit') {
        let product = this.activeProducts.find(el => el.name === data.name);
        product.name = data.name;
        product.note = data.note;
        product.price = data.price;
        product.keyword = data.keyword;
        this.calcCurrentCost();
      }
      if (data && data.mode === 'add') {
        this.addElement({
          name: data.name,
          note: data.note,
          price: data.price,
          keyword: data.keyword
        });
      }
    });
    modal.present();
  }

  showSettingsModal() {
    let modal = this.modalCtrl.create(SettingsPage, {
      resultsCount: this.resultsCount,
      resultsType: this.resultsType
    });
    modal.onDidDismiss(data => {
      if (data) {
        this.resultsType = data.resultsType,
          this.resultsCount = data.resultsCount
      }
    });
    modal.present();
  }

  showAddlistModal() {
    this.addlistModal.style.display = 'block'
  }

  closeAddlistModal() {
    this.addlistModal.style.display = "none";
  }

  showClearListModal() {
    this.clearListModal.style.display = 'block'
  }

  closeClearListModal() {
    this.clearListModal.style.display = "none";
  }

  // showSuggestions() {
  //   this.toggleSuggestions();
  //   this.contentToShow = this.content.filter(el => el.name.search(new RegExp(this.searchInput.value, 'i')) !== -1);
  // }
  //
  // toggleSuggestions(turnOff = false) {
  //   let suggestions = document.getElementById('suggestions');
  //   if (this.searchInput.value === '' || turnOff === true)
  //     suggestions.style.display = 'none';
  //   else if (suggestions.style.display === 'none' && this.searchInput.value !== '')
  //     suggestions.style.display = 'block'
  // }


  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    this.lists = this.lists.filter(el => el.name !== 'Default');
    this.storage.set('lists', this.lists);
  }
}
