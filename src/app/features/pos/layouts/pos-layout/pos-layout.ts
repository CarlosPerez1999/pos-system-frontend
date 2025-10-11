import { Component } from '@angular/core';
import { Header } from "../components/header/pos-header";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pos-layout',
  imports: [Header, RouterOutlet ],
  templateUrl: './pos-layout.html',
})
export default class PosLayout {

}
