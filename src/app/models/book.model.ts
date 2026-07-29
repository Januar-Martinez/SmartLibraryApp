export interface Book {
  id: string;
  title: string;
  author: string;
  stock: number;
}

export type BookDto = Omit<Book, 'id'>;