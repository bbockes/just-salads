export type Flavor = 'Tangy' | 'Creamy' | 'Spicy' | 'Fresh' | 'Savory' | 'Umami';

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'Year-round';

export type SubCuisine =
  | 'American'
  | 'Italian'
  | 'Greek'
  | 'French'
  | 'Middle Eastern'
  | 'Spanish'
  | 'Mexican'
  | 'Indian'
  | 'Thai'
  | 'Japanese'
  | 'Korean'
  | 'Vietnamese';

export type Salad = {
  id: number;
  name: string;
  imageSlug: string;
  cuisine: string;
  subCuisine: SubCuisine;
  flavorTags: Flavor[];
  seasons: Season[];
  ingredients: string[];
  steps: string[];
};

export type SaladFilters = {
  query: string;
  cuisine: SubCuisine | null;
  flavor: Flavor | null;
  season: Season | null;
};
