export default function FilterBar({ filters, setFilters, type = 'movies' }) {
  return (
    <div className="bg-gray-800 p-4 rounded mb-6 space-y-4">
      <h3 className="text-lg font-semibold">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categoría */}
        <div>
          <label className="block text-sm mb-2">Categoría</label>
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
            className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
          >
            <option value="">Todas</option>
            <option value="Familia">Familia</option>
            <option value="Solo">Solo</option>
            <option value="Otra persona">Otra persona</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm mb-2">Prioridad</label>
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value || null })}
            className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
          >
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Estado (solo para series) */}
        {type === 'series' && (
          <div>
            <label className="block text-sm mb-2">Estado</label>
            <select
              value={filters.state || ''}
              onChange={(e) => setFilters({ ...filters, state: e.target.value || null })}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Viéndola">Viéndola</option>
              <option value="En pausa">En pausa</option>
              <option value="Completada">Completada</option>
              <option value="Abandonada">Abandonada</option>
            </select>
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="block text-sm mb-2">Rating mín</label>
          <input
            type="number"
            min="0"
            max="5"
            value={filters.minRating || ''}
            onChange={(e) => setFilters({ ...filters, minRating: e.target.value ? parseFloat(e.target.value) : null })}
            className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
            placeholder="0-5"
          />
        </div>
      </div>

      {/* Limpiar filtros */}
      <button
        onClick={() => setFilters({})}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
      >
        Limpiar filtros
      </button>
    </div>
  );
}