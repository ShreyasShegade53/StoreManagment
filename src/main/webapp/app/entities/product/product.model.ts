export interface IProduct {
  id: number;
  name?: string | null;
  category?: string | null;
  company?: string | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
