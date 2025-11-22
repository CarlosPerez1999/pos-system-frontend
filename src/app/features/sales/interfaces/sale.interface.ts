export interface Sale {
    id: number;
    date: Date;
    total: number;
    items: {
        productId: number;
        quantity: number;
        price: number;
    }[];
}
