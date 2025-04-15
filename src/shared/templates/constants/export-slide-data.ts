export interface ExportSlideData {
  heading: string;
  bulletPoints: (string | string)[];
  imageSuggestions: string[];
  imageUrls: {
    title: string;
    height: any;
    width: any;
    imageUrl: string;
  }[];
}