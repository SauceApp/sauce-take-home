export interface IHighlight {
  id: number;
  quote: string;
  summary: string;
}

export interface Feedback {
  id: number;
  text: string;
  highlights?: IHighlight[];
}
