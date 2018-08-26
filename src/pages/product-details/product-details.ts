import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the ProductDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  name:string;
  price:string;
  note:string;
  keyword:string;
  mode: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.name = this.navParams.get('name');
    this.price = this.navParams.get('price');
    this.note = this.navParams.get('note');
    this.keyword = this.navParams.get('keyword');
    this.mode = this.navParams.get('mode');
  }

  ionViewDidLoad() {
  }

  cancel(){
    this.navCtrl.pop({});
  }
  save(){
    this.viewCtrl.dismiss({name:this.name, price: this.price, note: this.note, keyword: this.keyword, mode: this.mode});
  }

}
