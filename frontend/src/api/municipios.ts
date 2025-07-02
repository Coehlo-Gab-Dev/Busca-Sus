import { API_BASE_URL } from './config';

export const fetchMunicipios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/municipios`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar municípios:', error);
    throw error;
  }
};