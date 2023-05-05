export interface IStoreName {
  id: number;
  name?: string | null;
}

export type NewStoreName = Omit<IStoreName, 'id'> & { id: null };
