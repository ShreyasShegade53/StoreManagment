export interface ISoldProduct {
  id: number;
  name?: string | null;
  category?: string | null;
  price?: number | null;
  units?: number | null;
  company?: string | null;
}

export type NewSoldProduct = Omit<ISoldProduct, 'id'> & { id: null };
