import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import './ListsPage.css';

interface ListsPageProps {
  onSelectList: (listId: number) => void;
}

/**
 * トップ画面 - リスト一覧と新規作成
 */
export function ListsPage({ onSelectList }: ListsPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  // リスト一覧をリアルタイムで取得
  const lists = useLiveQuery(() => db.lists.orderBy('updatedAt').reverse().toArray());

  // 新しいリストを作成
  const handleCreateList = async () => {
    if (!newListTitle.trim()) {
      alert('リストのタイトルを入力してください');
      return;
    }

    try {
      await db.lists.add({
        title: newListTitle.trim(),
        description: newListDescription.trim() || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setNewListTitle('');
      setNewListDescription('');
      setIsCreating(false);
    } catch (error) {
      console.error('リストの作成に失敗しました:', error);
      alert('リストの作成に失敗しました');
    }
  };

  // リストを削除
  const handleDeleteList = async (listId: number) => {
    if (!confirm('このリストを削除しますか？関連するアイテムも全て削除されます。')) {
      return;
    }

    try {
      // リストに属するアイテムも全て削除
      await db.items.where('listId').equals(listId).delete();
      await db.lists.delete(listId);
    } catch (error) {
      console.error('リストの削除に失敗しました:', error);
      alert('リストの削除に失敗しました');
    }
  };

  return (
    <div className="lists-page">
      <header className="page-header">
        <h1>🎲 ランダム決定ツール</h1>
        <p>リストを選んで、ランダムに1つ決めましょう！</p>
      </header>

      <div className="lists-container">
        {!isCreating && (
          <button 
            className="create-button"
            onClick={() => setIsCreating(true)}
          >
            ➕ 新しいリストを作成
          </button>
        )}

        {isCreating && (
          <div className="create-form">
            <h3>新しいリストを作成</h3>
            <input
              type="text"
              placeholder="リストのタイトル（例：今晩のおかず）"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              autoFocus
            />
            <textarea
              placeholder="説明（オプション）"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              rows={3}
            />
            <div className="form-buttons">
              <button onClick={handleCreateList} className="primary">
                作成
              </button>
              <button onClick={() => {
                setIsCreating(false);
                setNewListTitle('');
                setNewListDescription('');
              }}>
                キャンセル
              </button>
            </div>
          </div>
        )}

        <div className="lists-grid">
          {lists?.map((list) => (
            <div key={list.id} className="list-card">
              <div 
                className="list-card-content"
                onClick={() => onSelectList(list.id!)}
              >
                <h3>{list.title}</h3>
                {list.description && <p>{list.description}</p>}
              </div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList(list.id!);
                }}
                title="削除"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {lists && lists.length === 0 && !isCreating && (
          <div className="empty-state">
            <p>まだリストがありません</p>
            <p>「新しいリストを作成」ボタンから始めましょう</p>
          </div>
        )}
      </div>
    </div>
  );
}
