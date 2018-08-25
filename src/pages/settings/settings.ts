import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  resultsCount: number;
  resultsType: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.resultsCount = this.navParams.get('resultsCount');
    this.resultsType = this.navParams.get('resultsType');
  }


  cancel(){
    this.navCtrl.pop({});
  }
  save(){
    this.viewCtrl.dismiss({
      resultsCount: this.resultsCount,
      resultsType: this.resultsType
    });
  }

}
