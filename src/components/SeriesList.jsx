import { useState } from 'react';
import ItemForm from './ItemForm';
import FilterBar from './FilterBar';
import ProfileView from './ProfileView';
import RecommendationView from './RecommendationView';
import { analyzeProfile, recommendFromList, detectAlerts } from '../utils/analytics';

export default function SeriesList({ series, setSeries }) {
  const [filters, setFilters] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Agregar serie
  const handleAddSerie = (newSerie) => {
    setSeries([...series, newSerie]);
  };

  // Actualizar serie
  const handleUpdateSerie = (id, updatedSerie) => {
    setSeries(series.map(s => s.id === id ? updatedSerie : s));
    setEditingId(null);
  };

  // Eliminar serie
  const handleDeleteSerie = (id) => {
    if (confirm('¿Seguro que quieres eliminar?')) {
      setSeries(series.filter(s => s.id !== id));
    }
  };

  // Filtrar series
  const filteredSeries = series.filter(serie => {
    if (filters.category && serie.category !== filters.category) return false;
    if (filters.priority && serie.priority !== filters.priority) return false;
    if (filters.state && serie.state !== filters.state) return false;
    if (filters.minRating && serie.rating < filters.minRating) return false;
    return true;
  });

  const profile = analyzeProfile(series);
  const alerts = detectAlerts(series, 'series');
  const recommendation = showRecommendation ? recommendFromList(filteredSeries, 'series') : null;

  return (
    <div>
      {/* Título */}
      <h2 className="text-3xl font-bold mb-6">📺 Series</h2>

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
      {showProfile && profile && <ProfileView profile={profile} type="series" />}

      {/* Recomendación */}
      {showRecommendation && recommendation && (
        <RecommendationView item={recommendation} type="series" />
      )}

      {/* Agregar serie */}
      <ItemForm type="series" onAdd={handleAddSerie} />

      {/* Filtros */}
      <FilterBar filters={filters} setFilters={setFilters} type="series" />

      {/* Lista de series */}
      <div className="space-y-4">
        {filteredSeries.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay series con estos filtros</p>
        ) : (
          filteredSeries.map(serie => (
            <SerieCard
              key={serie.id}
              serie={serie}
              onUpdate={handleUpdateSerie}
              onDelete={handleDeleteSerie}
              isEditing={editingId === serie.id}
              setEditing={setEditingId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SerieCard({ serie, onUpdate, onDelete, isEditing, setEditing }) {
  const [editForm, setEditForm] = useState(serie);

  const handleSaveEdit = () => {
    onUpdate(serie.id, { ...editForm, lastUpdate: new Date().toISOString() });
  };

  const getStateColor = (state) => {
    const colors = {
      'Pendiente': 'bg-gray-600',
      'Viéndola': 'bg-green-600',
      'En pausa': 'bg-yellow-600',
      'Completada': 'bg-blue-600',
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
        />

        <select
          value={editForm.state}
          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Viéndola">Viéndola</option>
          <option value="En pausa">En pausa</option>
          <option value="Completada">Completada</option>
          <option value="Abandonada">Abandonada</option>
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="1"
            value={editForm.season}
            onChange={(e) => setEditForm({ ...editForm, season: parseInt(e.target.value) })}
            placeholder="Temporada"
            className="bg-gray-700 text-white p-2 rounded"
          />
          <input
            type="number"
            min="1"
            value={editForm.episode}
            onChange={(e) => setEditForm({ ...editForm, episode: parseInt(e.target.value) })}
            placeholder="Episodio"
            className="bg-gray-700 text-white p-2 rounded"
          />
        </div>

        <select
          value={editForm.category}
          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="Familia">Familia</option>
          <option value="Solo">Solo</option>
          <option value="Otra persona">Otra persona</option>
        </select>

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
          <h3 className="text-xl font-semibold">{serie.name}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStateColor(serie.state)}`}>
              {serie.state}
            </span>
            <p className="text-gray-400 text-sm">
              {serie.category === 'Otra persona' ? `👥 ${serie.categoryPerson}` : serie.category} · {serie.priority}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-yellow-400">⭐ {serie.rating || 'N/A'}</p>
        </div>
      </div>

      <div className="bg-gray-700 p-2 rounded text-sm">
        <p>Temporada {serie.season} · Episodio {serie.episode}</p>
        {serie.totalSeasons && <p className="text-gray-400">Total: {serie.totalSeasons} temporadas</p>}
        {serie.timesWatched > 0 && <p className="text-gray-400">Visto {serie.timesWatched}x</p>}
      </div>

      {serie.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {serie.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {serie.observations && (
        <p className="text-gray-300 text-sm">{serie.observations}</p>
      )}

      <div className="text-gray-400 text-xs">
        Registrada: {new Date(serie.registeredAt).toLocaleDateString()}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setEditing(serie.id)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(serie.id)}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}