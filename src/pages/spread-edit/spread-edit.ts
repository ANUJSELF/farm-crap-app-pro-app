import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

import { Field } from '../../providers/field';
import { Strings } from '../../providers/strings';
import { Settings } from '../../providers/settings';
import { CalcCore } from '../../providers/calc-core';

/*
  Generated class for the SpreadEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-spread-edit',
  templateUrl: 'spread-edit.html'
})
export class SpreadEditPage {
  field: any;
  spread: any;
  @ViewChild(Slides) slides: Slides;
  strings: Object;
  customManureList: Object[];
  cropRequirementsSupply: Object;
  cropAvailable: Object;

  spreadDate: string;
  manureType: string = 'cattle';
  manureQuality:string = 'dm2';
  manureApplicationType: string = 'splash-surface';
  manureDensity = 50;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stringsProvider: Strings,
    private fieldProvider: Field,
    private settingsProvider: Settings,
    private calcCore: CalcCore
  ) {
    // Get field data
    this.field = fieldProvider.fields[navParams.data.fieldIndex];
    // Get spread data
    this.spread = this.field.spreads[navParams.data.spreadIndex];
    console.log(this.spread);
    this.spreadDate = this.spread.spreadDate;
    this.manureType = this.spread.manureType;
    this.manureQuality = this.spread.manureQuality;
    this.manureApplicationType = this.spread.manureApplicationType;
    this.manureDensity = this.spread.manureDensity;
    // Load strings
    this.strings = stringsProvider.data;
    // Get custom manure
    this.customManureList = settingsProvider.customManure;
    // Get and display crop supply/requirements
    this.cropRequirementsSupply = this.calcCore.getCropRequirementsSupply(
      this.settingsProvider.rainfall,
      this.field.newCropType,
      this.field.soilType,
      this.field.oldCropType,
      this.field.organicManures,
      this.field.soilTestP,
      this.field.soilTestK,
      this.field.grassGrown
    );
  }

  // Previous button handler
  prevPressed() {
    this.slides.slidePrev();
  }

  // Next button handler
  nextPressed() {
    this.slides.slideNext();
    this.calculate();
  }

  getSeason(month) {
    switch (month) {
      case 12:
      case 1:
      case 2:
        return 'winter';
      case 3:
      case 4:
      case 5:
        return 'spring';
      case 6:
      case 7:
      case 8:
        return 'summer';
      case 9:
      case 10:
      case 11:
        return 'winter';
    };
  }

  calculate() {
    // Calculate season from spread date
    let season: string = this.getSeason(new Date(this.spreadDate).getMonth() + 1);
    
    // Perform calculations based on inputs
    this.cropAvailable = this.calcCore.getNutrients(
      this.manureType,
      this.manureDensity,
      this.manureQuality,
      season,
      this.field.newCropType,
      this.field.soilType,
      this.manureApplicationType,
      this.field.soilTestP,
      this.field.soilTestK
    );
  }

  // Save button handler
  savePressed() {
    // Create spread Object
    let spread = {
      spreadDate: this.spreadDate,
      manureType: this.manureType,
      manureQuality: this.manureQuality,
      manureApplicationType: this.manureApplicationType,
      manureDensity: this.manureDensity
    };
    // Add spread to field spread list
    this.fieldProvider.setSpread(this.navParams.data.fieldIndex, this.navParams.data.spreadIndex, spread);
    // Navigate back to home
    this.navCtrl.pop();
  }

}
