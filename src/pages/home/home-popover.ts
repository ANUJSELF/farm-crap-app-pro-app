import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { SettingsPage } from '../settings/settings';
import { CalculatorPage } from '../calculator/calculator';
import { CalcCore } from '../../providers/calc-core';
import { Field } from '../../providers/field';

import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="about()">About</button>
      <button ion-item (click)="settings()">Settings</button>
      <button ion-item (click)="calculator()">Calculator</button>
      <button ion-item (click)="export()">Export Data</button>
    </ion-list>
  `,
  providers: [
    File,
    SocialSharing
  ]
})
export class PopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    private calcCore: CalcCore,
    private fieldProvider: Field,
    private file: File,
    private SocialSharing: SocialSharing
  ) {}

  about() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(AboutPage);
  }

  settings() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(SettingsPage);
  }

  calculator() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(CalculatorPage);
  }

  export() {
    // Export data here
    let csvData = this.calcCore.toCSV(this.fieldProvider.fields);
    // Create/overwrite csv file from data and write to iOS tempDirectory
    this.file.writeFile(this.file.tempDirectory, 'fields.csv', csvData, {replace: true}) 
    .then((fileEntry) => {
      // Share csv file via email
      this.SocialSharing.shareViaEmail('', 'From your Crap Calculator', [], [], [], fileEntry.nativeURL);
    });
    // Hide popover
    this.viewCtrl.dismiss();
  }

}