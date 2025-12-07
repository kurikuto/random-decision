/**
 * リストの型定義
 */
export interface List {
  id?: number; // Dexieが自動生成
  title: string; // リストのタイトル（例：「今晩のおかず」「学習テーマ」）
  description?: string; // リストの説明（オプション）
  createdAt: Date;
  updatedAt: Date;
}

/**
 * アイテムの型定義
 */
export interface Item {
  id?: number; // Dexieが自動生成
  listId: number; // 所属するリストのID
  title: string; // アイテムのタイトル（例：「カレー」「React Hooks」）
  content?: string; // アイテムの内容・詳細説明
  tags?: string[]; // タグ（オプション）
  weight?: number; // 重みづけ（将来の拡張用、デフォルト1）
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 選択履歴の型定義（将来の拡張用）
 */
export interface SelectionHistory {
  id?: number;
  listId: number;
  itemId: number;
  selectedAt: Date;
}
