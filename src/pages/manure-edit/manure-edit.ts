import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';

@IonicPage()
@Component({
  selector: 'page-manure-edit',
  templateUrl: 'manure-edit.html'
})
export class ManureEditPage {
  name: string;
  nitrogenContent: number;
  phosphorousContent: number;
  potassiumContent: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsProvider:Settings) {
    let manure: any = settingsProvider.customManure[navParams.data.customManureIndex];
    this.name = manure.name;
    this.nitrogenContent = manure.content[0];
    this.phosphorousContent = manure.content[1];
    this.potassiumContent = manure.content[2];
  }

  savePressed() {
    // Overwrite existing manure at this index
    this.settingsProvider.setCustomManure(this.navParams.data.customManureIndex, {
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
