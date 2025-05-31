import { jwtDecode } from 'jwt-decode';

export const API_URL = 'http://localhost:3000/api/';

const token = localStorage.getItem('token');


export const TOKEN = token ? `Bearer ${token}` : '';
