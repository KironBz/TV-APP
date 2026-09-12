import axios from 'axios';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GIST_ID = import.meta.env.VITE_GIST_ID;

const client = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

/**
 * Cargar datos desde Gist
 */
export async function loadFromGist() {
  try {
    const response = await client.get(`/gists/${GIST_ID}`);
    const file = response.data.files['tv-app-data.json'];
    if (!file) throw new Error('Archivo tv-app-data.json no encontrado en Gist');
    
    return JSON.parse(file.content);
  } catch (error) {
    console.error('Error cargando Gist:', error);
    return { movies: [], series: [] };
  }
}

/**
 * Guardar datos en Gist
 */
export async function saveToGist(data) {
  try {
    await client.patch(`/gists/${GIST_ID}`, {
      files: {
        'tv-app-data.json': {
          content: JSON.stringify(data, null, 2),
        },
      },
    });
  } catch (error) {
    console.error('Error guardando Gist:', error);
  }
}