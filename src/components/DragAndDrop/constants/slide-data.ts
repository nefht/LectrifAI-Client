export interface SlideData {
  title: string;
  slides: {
    heading: string;
    bulletPoints: (string | string[])[];
    imageSuggestions?: string[];
    imageUrls?: {
      height: number;
      width: number;
      title: string;
      imageUrl: string;
    }[];
  }[];
}
