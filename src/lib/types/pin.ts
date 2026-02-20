export interface Pin {
  id: string;
  type: "image" | "link" | "note";
  title: string;
  imageUrl?: string;
  linkUrl?: string;
  linkPreview?: {
    title: string;
    description: string;
    image: string;
  };
  content?: string;
  room: string;
  tags: string[];
  aiAnalysis?: {
    style: string;
    colors: string[];
    suggestions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
