import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../interfaces/cart.interface';
import { Product } from '../../../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing the shopping cart.
 * Handles adding, removing, and clearing products from the cart.
 */
export class CartService {
  private items = signal<CartItem[]>([]);
  productsInCart = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  total = computed(() =>
    this.items().reduce(
      (acc, item) => acc + +item.product.price * +item.quantity,
      0
    )
  );

  getProducts() {
    return this.items.asReadonly();
  }

  /**
   * Adds a product to the cart or increases its quantity.
   * Respects stock limits and adjusts quantity if needed.
   * @param product The product to add.
   * @param quantity The quantity to add (default: 1).
   */
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

  /**
   * Removes a product from the cart or decreases its quantity.
   * If quantity reaches zero, removes the item completely.
   * @param product The product to remove.
   * @param quantity The quantity to remove (default: 1).
   */
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

  /**
   * Removes a product completely from the cart.
   * @param product The product to clear.
   */
  clearProduct(product: Product) {
    this.items.update((items) =>
      items.filter((item) => item.product.id !== product.id)
    );
  }

  /**
   * Clears all items from the cart.
   */
  clearCart() {
    this.items.set([]);
  }
}
