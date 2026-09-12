import { useState, useEffect } from 'react';
import MoviesList from './components/MoviesList';
import SeriesList from './components/SeriesList';
import { loadFromGist, saveToGist } from './utils/gistSync';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' o 'series'
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Gist al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadFromGist();
        setMovies(data.movies || []);
        setSeries(data.series || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Guardar a Gist cuando cambien movies o series
  useEffect(() => {
    if (!loading) {
      saveToGist({ movies, series }).catch(console.error);
    }
  }, [movies, series, loading]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-6 border-b border-gray-700">
        <h1 className="text-4xl font-bold">📺 TV App</h1>
        <p className="text-gray-400">Tu curador cinematográfico personal</p>
      </header>

      {/* Tabs */}
      <nav className="bg-gray-800 p-4 flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-6 py-2 rounded font-semibold transition ${
            activeTab === 'movies'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🎬 Películas
        </button>
        <button
          onClick={() => setActiveTab('series')}
          className={`px-6 py-2 rounded font-semibold transition ${
            activeTab === 'series'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📺 Series
        </button>
      </nav>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <p className="text-center text-gray-400">Cargando...</p>
        ) : activeTab === 'movies' ? (
          <MoviesList movies={movies} setMovies={setMovies} />
        ) : (
          <SeriesList series={series} setSeries={setSeries} />
        )}
      </main>
    </div>
  );
}