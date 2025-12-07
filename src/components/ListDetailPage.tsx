import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Item } from '../types';
import './ListDetailPage.css';

interface ListDetailPageProps {
  listId: number;
  onBack: () => void;
  onRandomSelect: (item: Item) => void;
}

/**
 * リスト詳細画面 - アイテム一覧とランダム選択
 */
export function ListDetailPage({ 
  listId, 
  onBack, 
  onRandomSelect 
}: ListDetailPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');

  // リスト情報を取得
  const list = useLiveQuery(() => db.lists.get(listId), [listId]);

  // アイテム一覧を取得
  const items = useLiveQuery(
    () => db.items.where('listId').equals(listId).toArray(),
    [listId]
  );

  // 新しいアイテムを追加
  const handleAddItem = async () => {
    if (!newItemTitle.trim()) {
      alert('アイテムのタイトルを入力してください');
      return;
    }

    try {
      await db.items.add({
        listId,
        title: newItemTitle.trim(),
        content: newItemContent.trim() || undefined,
        weight: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setNewItemTitle('');
      setNewItemContent('');
      setIsCreating(false);
    } catch (error) {
      console.error('アイテムの追加に失敗しました:', error);
      alert('アイテムの追加に失敗しました');
    }
  };

  // アイテムを削除
  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('このアイテムを削除しますか?')) {
      return;
    }

    try {
      await db.items.delete(itemId);
    } catch (error) {
      console.error('アイテムの削除に失敗しました:', error);
      alert('アイテムの削除に失敗しました');
    }
  };

  // ランダム選択を実行
  const handleRandomSelect = () => {
    if (!items || items.length === 0) {
      alert('アイテムがありません。まずアイテムを追加してください。');
      return;
    }

    // ランダムに1つ選択
    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedItem = items[randomIndex];
    
    if (selectedItem) {
      onRandomSelect(selectedItem);
    }
  };

  if (!list) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="list-detail-page">
      <header className="page-header">
        <button className="back-button" onClick={onBack}>
          ← 戻る
        </button>
        <div>
          <h1>{list.title}</h1>
          {list.description && <p>{list.description}</p>}
        </div>
      </header>

      <div className="actions">
        <button 
          className="random-button"
          onClick={handleRandomSelect}
          disabled={!items || items.length === 0}
        >
          🎲 ランダム選択
        </button>
        {!isCreating && (
          <button 
            className="add-button"
            onClick={() => setIsCreating(true)}
          >
            ➕ アイテムを追加
          </button>
        )}
      </div>

      {isCreating && (
        <div className="create-form">
          <h3>新しいアイテムを追加</h3>
          <input
            type="text"
            placeholder="タイトル（例：カレー、React Hooks）"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder="内容・詳細（オプション）"
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            rows={4}
          />
          <div className="form-buttons">
            <button onClick={handleAddItem} className="primary">
              追加
            </button>
            <button onClick={() => {
              setIsCreating(false);
              setNewItemTitle('');
              setNewItemContent('');
            }}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      <div className="items-container">
        {items && items.length > 0 ? (
          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-content">
                  <h3>{item.title}</h3>
                  {item.content && <p>{item.content}</p>}
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteItem(item.id!)}
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>まだアイテムがありません</p>
            <p>「アイテムを追加」ボタンから始めましょう</p>
          </div>
        )}
      </div>
    </div>
  );
}
