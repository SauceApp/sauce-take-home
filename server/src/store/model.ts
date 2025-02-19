export type Feedback = {
  id: number;
  text: string;
  highlights?: Highlight[];
};

export type Highlight = {
  summary: string;
  quote: string;
};
