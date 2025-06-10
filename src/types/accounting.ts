export interface Account {
  id: number;
  name: string;
  type: string;
  code: string;
  category?: string;
  parent_id?: number;
}

export interface JournalLine {
  account_id: number;
  debit: number;
  credit: number;
  account_name?: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  description: string;
  lines: JournalLine[];
  status?: string;
  attachment?: string;
}