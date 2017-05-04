import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, ItemSliding, ModalController } from 'ionic-angular';

import { Field } from '../../providers/field';

import { Strings } from '../../providers/strings';
import { Settings } from '../../providers/settings';
import { CalcCore } from '../../providers/calc-core';

import { LocalStorageService } from 'angular-2-local-storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public fields:Object[];
  private units: string;
  private strings: any;
  private hectaresToAcres: Function;
  private dismissSettingsPrompt: boolean;

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private fieldProvider: Field,
    private settingsProvider: Settings,
    private stringsProvider: Strings,
    private modalCtrl: ModalController,
    private calcCore: CalcCore,
    private localStorageService: LocalStorageService
  ) {
    // Check if settings prompt has been dismissed
    this.dismissSettingsPrompt = <boolean>this.localStorageService.get('fca.settings.dismissSettingsPrompt');
    // Get fields
    this.fields = this.fieldProvider.fields;
    // Show disclaimer if not accepted
    if (!settingsProvider.disclaimerAccepted) {
      this.showDisclaimerModal();
    }
    // Load strings
    this.strings = stringsProvider.data;
    // Load units
    this.units = settingsProvider.units;
    // Get converter helpers
    this.hectaresToAcres = calcCore.hectaresToAcres;
  }

  ionViewWillEnter() {
    // Re-load units
    this.units = this.settingsProvider.units;
  }

  deleteField(fieldIndex) {
    this.fieldProvider.deleteField(fieldIndex);
  }

  addField() {
    this.navCtrl.push('FieldAddPage');
  }

  editField(slidingItem: ItemSliding, fieldIndex) {
    // Close sliding drawer
    slidingItem.close();
    // Go to edit view
    this.navCtrl.push('FieldEditPage', {
      fieldIndex: fieldIndex
    })
  }

  viewField(fieldIndex) {
    this.navCtrl.push('FieldDetailPage', {
      fieldIndex: fieldIndex
    });
  }

  showDisclaimerModal() {
    let disclaimerModal = this.modalCtrl.create('DisclaimerPage');
    disclaimerModal.present();
  }

  openSettings() {
    // Select the settings tab
    this.navCtrl.parent.select(2);
  }

  dismissSettings() {
    this.dismissSettingsPrompt = true;
    this.localStorageService.set('fca.settings.dismissSettingsPrompt', true);
  }

}
