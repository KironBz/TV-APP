export default function ProfileView({ profile, type = 'movies' }) {
  if (!profile) {
    return <div className="text-gray-400">Sin datos para mostrar perfil</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded border border-gray-700 mb-6 space-y-4">
      <h3 className="text-2xl font-semibold">👤 Mi Perfil {type === 'movies' ? '🎬' : '📺'}</h3>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-3xl font-bold text-blue-400">{profile.totalItems}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-gray-400 text-sm">Rating promedio</p>
          <p className="text-3xl font-bold text-yellow-400">⭐ {profile.averageRating}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-gray-400 text-sm">Rating alto (4-5)</p>
          <p className="text-3xl font-bold text-green-400">{profile.distribution.highRating}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-gray-400 text-sm">Rating bajo (&lt;2)</p>
          <p className="text-3xl font-bold text-red-400">{profile.distribution.lowRating}</p>
        </div>
      </div>

      {/* Tags favoritos */}
      {profile.topTags.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">🏷️ Tags favoritos</h4>
          <div className="flex flex-wrap gap-3">
            {profile.topTags.map(({ tag, count }) => (
              <div key={tag} className="bg-blue-900 px-4 py-2 rounded">
                <p className="font-semibold">#{tag}</p>
                <p className="text-sm text-gray-300">{count} {type === 'movies' ? 'películas' : 'series'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distribución por categoría */}
      {Object.keys(profile.categories).length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">📂 Por categoría</h4>
          <div className="space-y-2">
            {Object.entries(profile.categories).map(([category, count]) => {
              const total = profile.totalItems;
              const percentage = Math.round((count / total) * 100);
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span>{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded h-2">
                    <div
                      className="bg-purple-600 h-2 rounded"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notas */}
      <div className="bg-gray-700 p-4 rounded text-sm text-gray-300">
        <p>Este perfil se calcula basándose en {profile.totalItems} {type === 'movies' ? 'película(s)' : 'serie(s)'} registrada(s).</p>
      </div>
    </div>
  );
}