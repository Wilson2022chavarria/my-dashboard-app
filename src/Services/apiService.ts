import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchSolicitudes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/voluntariado`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error);
    throw error;
  }
};
