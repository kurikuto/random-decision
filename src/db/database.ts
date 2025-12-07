import Dexie, { Table } from "dexie";
import { List, Item, SelectionHistory } from "../types";

/**
 * Dexieデータベースのクラス定義
 * IndexedDBを使ってブラウザにデータを保存
 */
export class RandomDecisionDB extends Dexie {
  // テーブルの型定義
  lists!: Table<List>;
  items!: Table<Item>;
  selectionHistory!: Table<SelectionHistory>;

  constructor() {
    super("RandomDecisionDB");

    // スキーマの定義（バージョン1）
    this.version(1).stores({
      lists: "++id, title, createdAt, updatedAt", // id は自動インクリメント
      items: "++id, listId, title, createdAt, updatedAt", // listIdでインデックス作成
      selectionHistory: "++id, listId, itemId, selectedAt",
    });
  }
}

// データベースのインスタンスをエクスポート
export const db = new RandomDecisionDB();
