// src/api/healthUnits.ts
import { API_BASE_URL } from './config';

// Defina o timeout como constante local
const REQUEST_TIMEOUT = 5000;

const fetchWithTimeout = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

export const fetchHealthUnits = async (category: string, municipio: string) => {
  try {
    const url = `${API_BASE_URL}/health-units?category=${encodeURIComponent(category)}&municipio=${encodeURIComponent(municipio)}`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    throw error;
  }
};  