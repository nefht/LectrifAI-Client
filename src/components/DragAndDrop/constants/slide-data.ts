export interface SlideData {
  title: string;
  slides: {
    heading: string;
    bulletPoints: (string | string[])[];
    imageSuggestions?: string[];
    imageUrls?: { title: string; imageUrl: string }[];
  }[];
}
