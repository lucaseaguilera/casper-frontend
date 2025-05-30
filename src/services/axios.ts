// src/services/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // o el dominio donde corre Laravel
  withCredentials: true, // importante para cookies
});

export default instance;
