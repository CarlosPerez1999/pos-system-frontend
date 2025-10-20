import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../../../shared/components/app-header/app-header';

@Component({
  selector: 'app-pos-layout',
  imports: [RouterOutlet, AppHeader ],
  templateUrl: './layout.html',
})
export default class PosLayout {

}
