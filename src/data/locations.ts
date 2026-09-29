// Customer flow fix (owner-approved 2026-09-28): real Ontario city/area
// names for the Approximate Location autocomplete, replacing the old
// 6-value hardcoded list. This is still a static, hand-curated list
// bundled with the app -- NOT a live geocoding/places lookup. It's real
// place names (city, province), searchable, but finite: it does not cover
// every address or hamlet in Canada.
//
// A precise, exhaustive, always-current result (matching arbitrary partial
// input the way Google Places/Mapbox does) needs an external
// geocoding/places API + key, which was intentionally NOT connected here
// per instructions -- see the Customer Flow fix report for what to wire up
// if/when the owner adds a provider.
export const ONTARIO_LOCATIONS: string[] = [
  // Greater Toronto Area (kept from the original 6, now alongside more)
  "Etobicoke, Ontario",
  "Downtown Toronto, Ontario",
  "North York, Ontario",
  "Scarborough, Ontario",
  "East York, Ontario",
  "York, Ontario",
  "Mississauga, Ontario",
  "Brampton, Ontario",
  "Vaughan, Ontario",
  "Markham, Ontario",
  "Richmond Hill, Ontario",
  "Newmarket, Ontario",
  "Aurora, Ontario",
  "King City, Ontario",
  "Pickering, Ontario",
  "Ajax, Ontario",
  "Whitby, Ontario",
  "Oshawa, Ontario",
  "Clarington, Ontario",
  "Milton, Ontario",
  "Oakville, Ontario",
  "Burlington, Ontario",
  "Caledon, Ontario",
  "Halton Hills, Ontario",
  "Georgina, Ontario",
  "Stouffville, Ontario",
  "Uxbridge, Ontario",
  // Golden Horseshoe / Southwestern Ontario
  "Hamilton, Ontario",
  "St. Catharines, Ontario",
  "Niagara Falls, Ontario",
  "Niagara-on-the-Lake, Ontario",
  "Welland, Ontario",
  "Grimsby, Ontario",
  "Guelph, Ontario",
  "Kitchener, Ontario",
  "Waterloo, Ontario",
  "Cambridge, Ontario",
  "Brantford, Ontario",
  "London, Ontario",
  "Woodstock, Ontario",
  "Stratford, Ontario",
  "Sarnia, Ontario",
  "Windsor, Ontario",
  "Chatham, Ontario",
  // Central / Eastern Ontario
  "Barrie, Ontario",
  "Orillia, Ontario",
  "Collingwood, Ontario",
  "Midland, Ontario",
  "Peterborough, Ontario",
  "Kawartha Lakes, Ontario",
  "Belleville, Ontario",
  "Kingston, Ontario",
  "Brockville, Ontario",
  "Cornwall, Ontario",
  "Ottawa, Ontario",
  "Orleans, Ontario",
  "Kanata, Ontario",
  "Nepean, Ontario",
  // Northern Ontario
  "Sudbury, Ontario",
  "North Bay, Ontario",
  "Sault Ste. Marie, Ontario",
  "Thunder Bay, Ontario",
  "Timmins, Ontario",
];
