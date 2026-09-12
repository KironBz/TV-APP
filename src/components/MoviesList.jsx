import { useState } from 'react';
import ItemForm from './ItemForm';
import FilterBar from './FilterBar';
import ProfileView from './ProfileView';
import RecommendationView from './RecommendationView';
import { analyzeProfile, recommendFromList, detectAlerts } from '../utils/analytics';

export default function MoviesList({ movies, setMovies }) {
  const [filters, setFilters] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Agregar película
  const handleAddMovie = (newMovie) => {
    setMovies([...movies, newMovie]);
  };

  // Actualizar película
  const handleUpdateMovie = (id, updatedMovie) => {
    setMovies(movies.map(m => m.id === id ? updatedMovie : m));
    setEditingId(null);
  };

  // Eliminar película
  const handleDeleteMovie = (id) => {
    if (confirm('¿Seguro que quieres eliminar?')) {
      setMovies(movies.filter(m => m.id !== id));
    }
  };

  // Filtrar películas
  const filteredMovies = movies.filter(movie => {
    if (filters.category && movie.category !== filters.category) return false;
    if (filters.priority && movie.priority !== filters.priority) return false;
    if (filters.minRating && movie.rating < filters.minRating) return false;
    if (filters.state && movie.state !== filters.state) return false;
    return true;
  });

  const profile = analyzeProfile(movies);
  const alerts = detectAlerts(movies, 'movies');
  const recommendation = showRecommendation ? recommendFromList(filteredMovies, 'movie') : null;

  return (
    <div>
      {/* Título */}
      <h2 className="text-3xl font-bold mb-6">🎬 Películas</h2>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, idx) => (
            <div key={idx} className="bg-yellow-900 border border-yellow-700 text-yellow-100 p-3 rounded">
              ⚠️ {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          {showProfile ? '✓ Cerrar perfil' : '👤 Mi perfil'}
        </button>
        <button
          onClick={() => setShowRecommendation(!showRecommendation)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          {showRecommendation ? '✓ Cerrar' : '🎲 ¿Qué veo?'}
        </button>
      </div>

      {/* Perfil */}
      {showProfile && profile && <ProfileView profile={profile} type="movies" />}

      {/* Recomendación */}
      {showRecommendation && recommendation && (
        <RecommendationView item={recommendation} type="movie" />
      )}

      {/* Agregar película */}
      <ItemForm type="movie" onAdd={handleAddMovie} />

      {/* Filtros */}
      <FilterBar filters={filters} setFilters={setFilters} type="movies" />

      {/* Lista de películas */}
      <div className="space-y-4">
        {filteredMovies.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay películas con estos filtros</p>
        ) : (
          filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onUpdate={handleUpdateMovie}
              onDelete={handleDeleteMovie}
              isEditing={editingId === movie.id}
              setEditing={setEditingId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function MovieCard({ movie, onUpdate, onDelete, isEditing, setEditing }) {
  const [editForm, setEditForm] = useState(movie);

  const handleSaveEdit = () => {
    onUpdate(movie.id, { ...editForm, lastUpdate: new Date().toISOString() });
  };

  const getStateColor = (state) => {
    const colors = {
      'Pendiente': 'bg-gray-600',
      'Vista': 'bg-blue-600',
      'En pausa': 'bg-yellow-600',
      'Abandonada': 'bg-red-600',
    };
    return colors[state] || 'bg-gray-600';
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 p-4 rounded border border-gray-700 space-y-3">
        <input
          type="text"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className="w-full bg-gray-700 text-white p-2 rounded"
          placeholder="Nombre"
        />

        <select
          value={editForm.state}
          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Vista">Vista</option>
          <option value="En pausa">En pausa</option>
          <option value="Abandonada">Abandonada</option>
        </select>

        <select
          value={editForm.category}
          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="Familia">Familia</option>
          <option value="Solo">Solo</option>
          <option value="Otra persona">Otra persona</option>
        </select>

        {editForm.category === 'Otra persona' && (
          <input
            type="text"
            value={editForm.categoryPerson}
            onChange={(e) => setEditForm({ ...editForm, categoryPerson: e.target.value })}
            className="w-full bg-gray-700 text-white p-2 rounded"
            placeholder="¿Con quién?"
          />
        )}

        <select
          value={editForm.priority}
          onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <input
          type="number"
          min="0"
          max="5"
          step="0.5"
          value={editForm.rating}
          onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) })}
          className="w-full bg-gray-700 text-white p-2 rounded"
          placeholder="Rating"
        />

        <input
          type="text"
          value={editForm.tags.join(', ')}
          onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
          className="w-full bg-gray-700 text-white p-2 rounded"
          placeholder="tags separados por coma"
        />

        <textarea
          value={editForm.observations}
          onChange={(e) => setEditForm({ ...editForm, observations: e.target.value })}
          className="w-full bg-gray-700 text-white p-2 rounded h-16"
          placeholder="Observaciones"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Guardar
          </button>
          <button
            onClick={() => setEditing(null)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded border border-gray-700 space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{movie.name}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStateColor(movie.state)}`}>
              {movie.state}
            </span>
            <p className="text-gray-400 text-sm">
              {movie.category === 'Otra persona' ? `👥 ${movie.categoryPerson}` : movie.category} · {movie.priority}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-yellow-400">⭐ {movie.rating || 'N/A'}</p>
        </div>
      </div>

      {movie.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {movie.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {movie.observations && (
        <p className="text-gray-300 text-sm">{movie.observations}</p>
      )}

      <div className="text-gray-400 text-xs">
        Registrada: {new Date(movie.registeredAt).toLocaleDateString()}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setEditing(movie.id)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(movie.id)}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}