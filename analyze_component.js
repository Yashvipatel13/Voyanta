const fs = require('fs');
const content = fs.readFileSync('figma_component.js', 'utf8');

console.log('Total length:', content.length);

// Find export or main component definitions
const exportedMatches = content.match(/export\s*\{[^}]+\}/g) || [];
console.log('Exports:', exportedMatches.slice(0, 5));

// Let's search for some strings: destinations, tabs, titles
const titleMatches = content.match(/"([^"\\]{4,50})"/g) || [];
const uniqueStrings = Array.from(new Set(titleMatches.map(s => s.replace(/"/g, ''))));

console.log('Sample interesting strings:');
const keywords = ['voyanta', 'trip', 'itinerary', 'day', 'budget', 'vibe', 'weather', 'hotel', 'flight', 'india', 'delhi', 'goa', 'jaipur', 'mumbai', 'kerala', 'manali', 'agra', 'varanasi', 'udaipur', 'plan', 'explore'];
const relevant = uniqueStrings.filter(s => keywords.some(k => s.toLowerCase().includes(k)));
console.log(relevant.slice(0, 100));

// Check if source code or module structure is present
const moduleNames = content.match(/["'](\.\/[^"']+)["']/g);
if (moduleNames) {
  console.log('Module names:', Array.from(new Set(moduleNames)).slice(0, 30));
}
