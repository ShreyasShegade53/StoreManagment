export interface IEmployee {
  id: number;
  name?: string | null;
  address?: string | null;
  phoneNo?: number | null;
  job?: string | null;
  username?: string | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
