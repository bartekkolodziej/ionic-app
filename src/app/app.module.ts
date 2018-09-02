import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import { MapPage} from '../pages/map/map';
import {ShoppingListPage} from "../pages/shopping-list/shopping-list";
import {HttpClientModule} from "@angular/common/http";
import {Geolocation} from '@ionic-native/geolocation';
import {Diagnostic} from "@ionic-native/diagnostic";
import {IonicStorageModule} from '@ionic/storage';
import {ProductDetailsPage} from "../pages/product-details/product-details";
import {SettingsPage} from "../pages/settings/settings";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {Network} from "@ionic-native/network";


@NgModule({
  declarations: [
    MyApp,
    MapPage,
    ShoppingListPage,
    ProductDetailsPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    ShoppingListPage,
    ProductDetailsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Diagnostic,
    AndroidPermissions,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
