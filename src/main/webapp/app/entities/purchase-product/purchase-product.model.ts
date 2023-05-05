export interface IPurchaseProduct {
  id: number;
  name?: string | null;
  category?: string | null;
  price?: number | null;
  units?: number | null;
  from?: string | null;
  company?: string | null;
}

export type NewPurchaseProduct = Omit<IPurchaseProduct, 'id'> & { id: null };
