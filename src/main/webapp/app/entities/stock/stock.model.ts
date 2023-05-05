export interface IStock {
  id: number;
  name?: string | null;
  category?: string | null;
  purchasePrice?: number | null;
  salePrice?: number | null;
  units?: number | null;
  company?: string | null;
}

export type NewStock = Omit<IStock, 'id'> & { id: null };
