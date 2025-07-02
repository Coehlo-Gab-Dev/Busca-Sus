import { fetchHealthUnits } from '../api/healthUnits';
import HealthUnitsSearch from './HealthUnitsSearch/HealthUnitsSearch';
import {API_BASE_URL} from '../api/config';
export const fetchMunicipios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/municipios`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar municípios:', error);
    throw error;
  }
};
export default {
    fetchMunicipios
  };