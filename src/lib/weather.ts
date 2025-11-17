// Simple weather helper with a placeholder fetch function.
// Replace the API_URL and add an API key in production.

export async function fetchWeatherForCoords(lat: number, lon: number) {
  let response;
  try {
    // Placeholder response to avoid network dependency in sample code.
    response = {
      temperature: '22°C',
      condition: lat > lon ? 'Partly Cloudy' : 'Clear Skies',
      icon: 'cloudy-outline',
      alert: null,
    };
  } catch (err) {
    console.warn('Weather fetch failed', err);
    response = { temperature: '--', condition: 'Unknown', icon: 'cloud-offline-outline', alert: null };
  }
  return response;
}

// transformWeather would map provider response to our UI shape.
