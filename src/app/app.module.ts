import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {SearchPage} from "../pages/search/search";
import {HttpClientModule} from "@angular/common/http";
import {Geolocation} from '@ionic-native/geolocation';
import {Diagnostic} from "@ionic-native/diagnostic";
import {IonicStorageModule} from '@ionic/storage';
import {ProductDetailsPage} from "../pages/product-details/product-details";
import {SettingsPage} from "../pages/settings/settings";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
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
    HomePage,
    SearchPage,
    ProductDetailsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
