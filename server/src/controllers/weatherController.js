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
    const { city = 'Leh' } = req.query;

    const lowerCity = city.toLowerCase();
    let selectedCondition = 'Pleasant & Sunny';
    let temp = 24;

    if (lowerCity.includes('leh') || lowerCity.includes('ladakh')) {
      selectedCondition = 'Clear Skies & Crisp Air';
      temp = 14;
    } else if (lowerCity.includes('spiti') || lowerCity.includes('manali') || lowerCity.includes('gulmarg')) {
      selectedCondition = 'Chilly Mountain Breeze';
      temp = 16;
    } else if (lowerCity.includes('goa') || lowerCity.includes('andaman') || lowerCity.includes('gokarna')) {
      selectedCondition = 'Tropical Sunshine';
      temp = 31;
    } else if (lowerCity.includes('coorg') || lowerCity.includes('munnar') || lowerCity.includes('shillong')) {
      selectedCondition = 'Misty & Pleasant';
      temp = 21;
    } else if (lowerCity.includes('udaipur') || lowerCity.includes('jaipur') || lowerCity.includes('varanasi')) {
      selectedCondition = 'Warm & Sunny';
      temp = 29;
    }

    const forecast = [
      { day: 1, temp: temp, condition: selectedCondition, alert: null },
      { day: 2, temp: temp - 3, condition: 'Heavy Rain & Mountain Thunderstorm', alert: 'Thunderstorm & Heavy Showers expected. Outdoor activities are unsafe.' },
      { day: 3, temp: temp + 1, condition: 'Partly Cloudy & Breezy', alert: null },
      { day: 4, temp: temp, condition: 'Clear Sky & Sunshine', alert: null }
    ];

    res.json({
      city,
      condition: selectedCondition,
      temperature: `${temp}°C`,
      current: {
        temp: `${temp}°C`,
        condition: selectedCondition,
        humidity: '58%',
        windSpeed: '12 km/h',
        uvIndex: 'Moderate (5)',
        feelsLike: `${temp}°C`
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
