/**
 * Analizar patrones de películas/series
 */
export function analyzeProfile(items) {
  if (items.length === 0) return null;

  const tags = {};
  const ratings = [];
  const categories = {};

  items.forEach(item => {
    // Tags
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    }

    // Ratings
    if (item.rating) ratings.push(item.rating);

    // Categorías
    const cat = item.category || 'Sin definir';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  const avgRating = ratings.length > 0
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : 'N/A';

  const topTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  return {
    totalItems: items.length,
    averageRating: avgRating,
    topTags,
    categories,
    distribution: {
      highRating: ratings.filter(r => r >= 4).length,
      mediumRating: ratings.filter(r => r >= 2 && r < 4).length,
      lowRating: ratings.filter(r => r < 2).length,
    },
  };
}

/**
 * Recomendar de la lista (basado en prioridad + tiempo esperando)
 */
export function recommendFromList(items, type = 'random') {
  if (items.length === 0) return null;

  const filtered = items.filter(item => {
    if (type === 'series') {
      return item.state !== 'Completada' && item.state !== 'Abandonada';
    } else if (type === 'movies') {
      return item.state !== 'Vista';
    }
    return true;
  });

  if (filtered.length === 0) return null;

  // Score: prioridad Alta = 3, Media = 2, Baja = 1, + tiempo esperando
  const scored = filtered.map(item => {
    const priorityScore = item.priority === 'Alta' ? 3 : item.priority === 'Media' ? 2 : 1;
    const daysSinceAdded = Math.floor(
      (Date.now() - new Date(item.registeredAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const score = priorityScore * 10 + daysSinceAdded;
    return { ...item, score };
  });

  const recommended = scored.sort((a, b) => b.score - a.score)[0];
  return recommended;
}

/**
 * Detectar alertas
 */
export function detectAlerts(items, type = 'movies') {
  const alerts = [];
  const now = Date.now();

  items.forEach(item => {
    const daysSinceAdded = Math.floor(
      (now - new Date(item.registeredAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Alert: item olvidado (>30 días sin avance)
    if (item.lastUpdate) {
      const daysSinceUpdate = Math.floor(
        (now - new Date(item.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceUpdate > 30) {
        alerts.push({
          type: 'forgotten',
          message: `"${item.name}" no ha avanzado hace ${daysSinceUpdate} días`,
          item,
        });
      }
    }

    // Alert: muchos items pendientes
    if (type === 'series' && item.state === 'Pendiente' && daysSinceAdded > 60) {
      alerts.push({
        type: 'long-pending',
        message: `"${item.name}" está pendiente desde hace ${daysSinceAdded} días`,
        item,
      });
    }
  });

  return alerts;
}