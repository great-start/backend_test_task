export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  bossId?: number;
  subordinates?: IUser[];
}
