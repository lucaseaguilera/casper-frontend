import axios from 'axios';
import { User } from '../types/User';

export async function login(email: string, password: string): Promise<User> {
  const { data } = await axios.post('/api/login', { email, password });
  return data.user;
}