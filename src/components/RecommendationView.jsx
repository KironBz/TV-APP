import { useState } from 'react';

export default function RecommendationView({ item, type = 'movie' }) {
  const [revealed, setRevealed] = useState(false);

  const getStateEmoji = (state) => {
    const emojis = {
      'Pendiente': '⏳',
      'Viéndola': '▶️',
      'En pausa': '⏸️',
      'Completada': '✅',
      'Abandonada': '❌',
    };
    return emojis[state] || '❓';
  };

  const getRecommendationReason = (item, type) => {
    const reasons = [];

    if (item.priority === 'Alta') {
      reasons.push('tiene prioridad alta');
    }

    const daysSinceAdded = Math.floor(
      (Date.now() - new Date(item.registeredAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceAdded > 30) {
      reasons.push(`lleva ${daysSinceAdded} días en tu lista`);
    }

    if (item.rating > 0 && item.rating >= 4) {
      reasons.push('tiene buen rating');
    }

    if (type === 'series' && item.state === 'Viéndola') {
      reasons.push('estás en medio de verla');
    }

    return reasons.length > 0
      ? `Porque ${reasons.join(', ')}`
      : 'Es una buena opción para ver ahora';
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 rounded-lg mb-6 border-2 border-blue-600">
      <div className="text-center space-y-4">
        <p className="text-gray-300 text-lg">🎲 Mi recomendación para ti:</p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-bold transition"
          >
            Revelar
          </button>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white">{item.name}</h2>

              {type === 'series' && (
                <p className="text-lg text-gray-300">
                  {getStateEmoji(item.state)} {item.state} · T{item.season}E{item.episode}
                </p>
              )}

              {item.rating > 0 && (
                <p className="text-2xl text-yellow-400">⭐ {item.rating} / 5</p>
              )}

              {item.category && (
                <p className="text-gray-300">
                  {item.category === 'Otra persona' ? `👥 Ver con ${item.categoryPerson}` : item.category}
                </p>
              )}
            </div>

            {item.tags.length > 0 && (
              <div className="flex justify-center flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-800 text-blue-200 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 italic">
              {getRecommendationReason(item, type)}
            </p>

            {item.observations && (
              <p className="text-gray-400 text-sm italic">"{item.observations}"</p>
            )}

            <button
              onClick={() => setRevealed(false)}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm mt-4"
            >
              Ocultar
            </button>
          </>
        )}
      </div>
    </div>
  );
}