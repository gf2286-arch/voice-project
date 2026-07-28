import { isConfigured, USE_MOCKS } from './config'
import type { WeatherSnapshot } from './types'

/**
 * Weather API boundary.
 *
 * Muse uses the forecast to dress you for the real day. Today this returns a
 * pleasant mock; wiring a live provider means implementing `fetchLiveWeather`
 * and nothing else in the app changes.
 */

const MOCK_WEATHER: WeatherSnapshot = {
  location: 'New York, NY',
  temperature: 24,
  unit: 'C',
  condition: 'sunny',
  summary: 'Sunny with a light breeze',
  high: 26,
  low: 18,
  precipitation: 0.05,
  stylingNote:
    'Warm and dry — breathable layers, and something light to throw on after sunset.',
}

async function fetchLiveWeather(location: string): Promise<WeatherSnapshot> {
  // TODO: Replace with a real Weather API call, e.g.
  //   const res = await fetch(
  //     `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}`,
  //   )
  //   const data = await res.json()
  //   return mapWeatherApiResponse(data)
  throw new Error('Live weather not implemented yet')
}

export async function getWeather(
  location = 'New York, NY',
): Promise<WeatherSnapshot> {
  if (!USE_MOCKS && isConfigured('weather')) {
    return fetchLiveWeather(location)
  }
  // Simulate network latency so loading states behave like production.
  await new Promise((r) => setTimeout(r, 300))
  return { ...MOCK_WEATHER, location }
}
