import { HttpClient } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currensy = '$';

  prodiuctsData: any;

  form = this.fb.group({
    product: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}
ngOnInit(){
  this.http.get("http://testologia.ru/cookies").subscribe(data => this.prodiuctsData =data)
}

  scrollTo(target: HTMLElement, product?: any): void {
    target.scrollIntoView({ behavior: 'smooth' });
    if (product) {
      this.form.patchValue({
        product:
          product.title + ' (' + product.price + ' ' + this.currensy + ')',
      });
    }
  }

  changeCurrens(): void {
    let newCurrency = '$';
    let coefficient = 1;

    if (this.currensy === '$') {
      newCurrency = '₽';
      coefficient = 90;
    } else if (this.currensy === '₽') {
      newCurrency = 'BYN';
      coefficient = 3;
    } else if (this.currensy === 'BYN') {
      newCurrency = '€';
      coefficient = 0.9;
    } else if (this.currensy === '€') {
      newCurrency = '¥';
      coefficient = 6.9;
    }
    this.currensy = newCurrency;

    this.prodiuctsData.forEach((item: any) => {
      item.price = +(item.basePrice * coefficient).toFixed(1);
    });
  }

  confirmOrder() {
    if (this.form.valid) {
      this.http
        .post('https://testologia.ru/cookies-order', this.form.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.form.reset();
          },
          error: (response: any) => {
            alert(response.error.message);
          }
        });
    } 
  }
}
