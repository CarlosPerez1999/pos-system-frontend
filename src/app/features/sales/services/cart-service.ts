import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../interfaces/cart.interface';
import { Product } from '../../../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items = signal<CartItem[]>([]);
  total = computed(() =>
    this.items().reduce(
      (acc, item) => acc + +item.product.price * +item.quantity,
      0
    )
  );

  getProducts() {
    return this.items.asReadonly();
  }

  addProduct(product: Product, quantity: number = 1) {
    if (quantity <= 0) return;

    this.items.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);

      if (existing) {
        const newQuantity = existing.quantity + quantity;

        if (newQuantity > product.stock) {
          return items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: product.stock }
              : item
          );
        }

        return items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      if (quantity > product.stock) {
        quantity = product.stock;
      }

      return [...items, { product, quantity }];
    });
  }

  removeProduct(product: Product, quantity: number = 1) {
    this.items.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (!existing) return items;

      const newQuantity = existing.quantity - quantity;
      if (newQuantity <= 0) {
        return items.filter((item) => item.product.id !== product.id);
      }

      return items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  }

  clearProduct(product: Product) {
    this.items.update((items) =>
      items.filter((item) => item.product.id !== product.id)
    );
  }

  clearCart() {
    this.items.set([]);
  }
}
