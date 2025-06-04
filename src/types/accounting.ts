export interface Account {
  id: number;
  name: string;
  type: string;
  code: string;
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
}