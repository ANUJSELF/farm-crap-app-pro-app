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
  strings: any;
  customManureList: Object[];
  cropRequirementsSupply: Object;
  cropAvailable: Object;
  manureCosts: Object;
  crapPicture: String;

  spreadDate: string;
  manureType: string;
  manureQuality:string;
  manureApplicationType: string;
  manureDensity: number;

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
    // Pre-perform calculations to initalise view
    this.calculate();
  }

  // Previous button handler
  prevPressed() {
    // Slide to values
    this.slides.slidePrev();
  }

  // Next button handler
  nextPressed() {
    // Perform calculations
    this.calculate();
    // Slide to calculated values
    this.slides.slideNext();
  }

  // Manure choice has changed, so update some ranges
  manureTypeChanged() {
    // Reset slider to half way
    this.manureDensity = this.strings.rangeMax[this.manureType] / 2;
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
    this.cropAvailable = this.calcCore.calculateNutrients(
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
    // Calculate manure costs
    this.manureCosts = [
      this.calcCore.getCostStringFromNutrient(0, this.cropAvailable, this.field.hectares),
      this.calcCore.getCostStringFromNutrient(1, this.cropAvailable, this.field.hectares),
      this.calcCore.getCostStringFromNutrient(2, this.cropAvailable, this.field.hectares)
    ];
    // Select image
    this.crapPicture = this.calcCore.findImage(this.manureType, this.manureDensity);
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
