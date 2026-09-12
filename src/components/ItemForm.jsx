import { useState } from 'react';

export default function ItemForm({ type = 'movie', onAdd, initialData = null }) {
  const [formData, setFormData] = useState(initialData || getEmptyForm(type));
  const [showForm, setShowForm] = useState(false);

  function getEmptyForm(t) {
    const base = {
      name: '',
      category: 'Solo',
      priority: 'Media',
      rating: 0,
      tags: '',
      observations: '',
      categoryPerson: '',
      state: 'Pendiente',
    };
    if (t === 'series') {
      return {
        ...base,
        season: 1,
        episode: 1,
        totalSeasons: '',
        totalEpisodes: '',
        timesWatched: 0,
      };
    }
    return base;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newItem = {
      id: Date.now(),
      ...formData,
      tags: tagsArray,
      rating: parseFloat(formData.rating) || 0,
      registeredAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
    };

    if (type === 'series') {
      newItem.season = parseInt(formData.season) || 1;
      newItem.episode = parseInt(formData.episode) || 1;
      newItem.totalSeasons = formData.totalSeasons ? parseInt(formData.totalSeasons) : null;
      newItem.totalEpisodes = formData.totalEpisodes ? parseInt(formData.totalEpisodes) : null;
      newItem.timesWatched = parseInt(formData.timesWatched) || 0;
    }

    onAdd(newItem);
    setFormData(getEmptyForm(type));
    setShowForm(false);
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
        >
          + Agregar {type === 'movie' ? 'película' : 'serie'}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded space-y-4">
          <h3 className="text-lg font-semibold">Agregar {type === 'movie' ? 'película' : 'serie'}</h3>

          {/* Nombre */}
          <div>
            <label className="block text-sm mb-1">Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
              placeholder="Ej: Breaking Bad"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm mb-1">Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
            >
              <option value="Familia">👨‍👩‍👧‍👦 Familia</option>
              <option value="Solo">🎧 Solo</option>
              <option value="Otra persona">👥 Otra persona</option>
            </select>
          </div>

          {/* Si es "Otra persona", pedir nombre */}
          {formData.category === 'Otra persona' && (
            <div>
              <label className="block text-sm mb-1">¿Con quién?</label>
              <input
                type="text"
                name="categoryPerson"
                value={formData.categoryPerson}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                placeholder="Nombre de la persona"
              />
            </div>
          )}

          {/* Prioridad */}
          <div>
            <label className="block text-sm mb-1">Prioridad</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm mb-1">Estado</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
            >
              {type === 'movie' ? (
                <>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Vista">Vista</option>
                  <option value="En pausa">En pausa</option>
                  <option value="Abandonada">Abandonada</option>
                </>
              ) : (
                <>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Viéndola">Viéndola</option>
                  <option value="En pausa">En pausa</option>
                  <option value="Completada">Completada</option>
                  <option value="Abandonada">Abandonada</option>
                </>
              )}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm mb-1">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.5"
              value={formData.rating}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm mb-1">Tags (separados por coma)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
              placeholder="Ej: drama, suspenso, crimen"
            />
          </div>

          {/* Si es serie: temporada, episodio */}
          {type === 'series' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Temporada</label>
                  <input
                    type="number"
                    name="season"
                    min="1"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Episodio</label>
                  <input
                    type="number"
                    name="episode"
                    min="1"
                    value={formData.episode}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Total temporadas (opt)</label>
                  <input
                    type="number"
                    name="totalSeasons"
                    min="1"
                    value={formData.totalSeasons}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Total episodios (opt)</label>
                  <input
                    type="number"
                    name="totalEpisodes"
                    min="1"
                    value={formData.totalEpisodes}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                  />
                </div>
              </div>
            </>
          )}

          {/* Observaciones */}
          <div>
            <label className="block text-sm mb-1">Observaciones</label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 h-20"
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}