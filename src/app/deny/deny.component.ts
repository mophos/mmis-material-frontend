import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wm-deny',
  templateUrl: './deny.component.html',
  styles: []
})
export class DenyComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['login']);
  }

}
