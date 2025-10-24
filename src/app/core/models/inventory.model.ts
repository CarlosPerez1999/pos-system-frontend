export interface InventoryMovement {
  id: string;
  quantity: number;
  movementType: 'OUT' | 'IN';
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null | Date;
}

export interface InventoryMovementResponse {
  items: InventoryMovement[];
  limit: number;
  offset: number;
  total: number;
}
export interface InventoryMovementCreate
  extends Omit<InventoryMovement, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    productId:string
  }

export interface InventoryMovementUpdate extends Partial<InventoryMovementCreate> {}
