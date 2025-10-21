/**
 *@loadMore is an input signal that receives a callback
 *Important! The callback must be passed with the "this" context if necessary.
 *    1.- This can be achieved by creating an Arrow Function in the component and within it calling the function in charge of loading more data.
 *    2.- Another option is to pass the function but using the .bind() method
 *
 *@elementRef The reference of the DOM element where the directive is used is injected
 *When calling @loadMore inside the observer, two pairs of parentheses must be used: the first to access the signal and the second to execute the callback `this.loadMore()()`
 *Finally, the @observer disconnects when the component is destroyed.
 */

import { Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class AppInfiniteScroll implements OnDestroy {
  loadMore = input.required<() => void>();

  elementRef = inject(ElementRef);

  constructor() {
    this.observer.observe(this.elementRef.nativeElement);
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadMore()();
      }
    });
  });

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
