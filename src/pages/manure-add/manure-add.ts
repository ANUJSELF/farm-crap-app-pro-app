import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';

@IonicPage()
@Component({
  selector: 'page-manure-add',
  templateUrl: 'manure-add.html'
})
export class ManureAddPage {
  name: string;
  nitrogenContent: number;
  phosphorousContent: number;
  potassiumContent: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsProvider:Settings) {}

  finishPressed() {
    // Add manure content to settings
    this.settingsProvider.addCustomManure({
      name: this.name,
      content: [
        this.nitrogenContent,
        this.phosphorousContent,
        this.potassiumContent
      ]
    });
    // Go back to settings
    this.navCtrl.pop();
  }

}
