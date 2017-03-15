import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SoilNitrogenSupply provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SoilNitrogenSupply {
  data: any;

  constructor(public http: Http) {
    this.data = null;
  }

  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('assets/json/soil-nitrogen-supply.json')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
        resolve(this.data);
      });
    })
  }

  // Calculate soil nitrogen supply
  calculateSNS(rainfallChoice, soilChoice, previousCropChoice) {
    let rainfallTree = this.data.choices;
    // Ascend down tree leaves
    for (let rainfallIndex in rainfallTree) {
      // Compare rainfall choice
      if (rainfallTree[rainfallIndex].choice === rainfallChoice) {
        let soilTree = rainfallTree[rainfallIndex].value.choices;
        for (let soilIndex in soilTree) {
          // Compare soil choice
          if (soilTree[soilIndex].choice === soilChoice) {
            // Check if the value is a number or deeper tree
            if (isNaN(soilTree[soilIndex].value)) {
              let previousCropTree = soilTree[soilIndex].value.choices;
              for (let previousCropIndex in previousCropTree) {
                if (previousCropTree[previousCropIndex].choice === previousCropChoice) {
                  return previousCropTree[previousCropIndex].value;
                }
              }
            } else {
              // Return value
              return soilTree[soilIndex].value;
            }
          }
        }
      }
    }
  }

}
