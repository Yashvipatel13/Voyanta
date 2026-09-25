// Smart Indoor Replacements Catalog
const INDOOR_REPLACEMENTS = [
  {
    title: "National Heritage & Contemporary Art Museum",
    description: "Indoor climate-controlled galleries featuring imperial artifacts, sculpture, and modern exhibitions.",
    costOffset: 5
  },
  {
    title: "Artisanal Pottery Workshop & Green Tea Ceremony",
    description: "Hands-on indoor ceramic wheel throwing followed by ceremonial whipped matcha in a cozy pavilion.",
    costOffset: 12
  },
  {
    title: "Historic Covered Arcade & Specialty Food Hall Crawl",
    description: "Explore dozens of protected indoor street-food stalls, fresh bakeries, and gourmet delis.",
    costOffset: 0
  },
  {
    title: "Underground Aquarium & Oceanic Discovery Center",
    description: "Walk through panoramic glass underwater tunnels amidst manta rays, sea turtles, and corals.",
    costOffset: 15
  },
  {
    title: "Old Town Heritage Cellar & Regional Cheese/Wine Tasting",
    description: "Intimate subterranean cellar tasting of regional vintages, sourdoughs, and aged cheeses.",
    costOffset: 18
  }
];

export const getWeather = async (req, res) => {
  try {
    const { city = 'Kyoto' } = req.query;

    // Realistic seasonal dynamic weather simulator (reliable offline / no external API key needed)
    // Supports triggering a simulated rain/storm alert on Day 2 to showcase smart adaptation
    const conditions = ['Partly Cloudy', 'Light Rain', 'Sunny', 'Thunderstorm', 'Breezy & Clear'];
    const selectedCondition = city.toLowerCase().includes('reykjavik') 
      ? 'Chilly Mist'
      : city.toLowerCase().includes('bali')
      ? 'Tropical Sunshine'
      : 'Passing Showers';

    const temp = city.toLowerCase().includes('swiss') ? 14 : city.toLowerCase().includes('goa') ? 31 : 22;

    const forecast = [
      { day: 1, temp: temp, condition: 'Sunny & Pleasant', alert: null },
      { day: 2, temp: temp - 3, condition: 'Heavy Rain & Thunderstorm', alert: 'Thunderstorm & Heavy Rain expected. Outdoor activities are unsafe.' },
      { day: 3, temp: temp + 1, condition: 'Partly Cloudy', alert: null },
      { day: 4, temp: temp, condition: 'Clear Sky', alert: null }
    ];

    res.json({
      city,
      current: {
        temp: `${temp}°C`,
        condition: selectedCondition,
        humidity: '68%',
        windSpeed: '14 km/h',
        uvIndex: 'Moderate (4)',
        feelsLike: `${temp + 1}°C`
      },
      forecast,
      activeAlert: {
        severity: 'Warning',
        dayNumber: 2,
        title: 'Weather Warning: High Precipitation',
        message: `Heavy rain and gusty winds detected in ${city}. Voyanta recommends switching outdoor activities to indoor cultural spots.`
      }
    });
  } catch (err) {
    console.error('Weather error:', err);
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
};

export const replaceActivityForWeather = async (req, res) => {
  try {
    const { activityTitle, dayNumber, currentCost } = req.body;

    // Pick a replacement from catalog
    const replacement = INDOOR_REPLACEMENTS[
      Math.floor(Math.random() * INDOOR_REPLACEMENTS.length)
    ];

    const newCost = Math.max(0, (Number(currentCost) || 20) + replacement.costOffset);

    res.json({
      message: 'Activity successfully adapted for weather!',
      originalTitle: activityTitle,
      adaptedActivity: {
        title: replacement.title,
        description: replacement.description,
        estimatedCost: newCost,
        isOutdoor: false,
        weatherAlert: 'Adapted from outdoor plan due to rain/storm alert',
        replacedWith: replacement.title
      }
    });
  } catch (err) {
    console.error('Weather replacement error:', err);
    res.status(500).json({ error: 'Failed to adapt activity for weather.' });
  }
};
