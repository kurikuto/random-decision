import { useState } from 'react';
import { ListsPage } from './components/ListsPage';
import { ListDetailPage } from './components/ListDetailPage';
import { ResultPage } from './components/ResultPage';
import { Item } from './types';
import './App.css';

/**
 * アプリケーションのメインコンポーネント
 * 画面遷移の管理を行う
 */

// 画面の種類を定義
type Screen = 
  | { type: 'lists' }
  | { type: 'detail'; listId: number }
  | { type: 'result'; item: Item; listId: number };

function App() {
  // 現在の画面を管理
  const [currentScreen, setCurrentScreen] = useState<Screen>({ type: 'lists' });

  // リスト選択時の処理
  const handleSelectList = (listId: number) => {
    setCurrentScreen({ type: 'detail', listId });
  };

  // リスト一覧に戻る
  const handleBackToLists = () => {
    setCurrentScreen({ type: 'lists' });
  };

  // ランダム選択結果を表示
  const handleShowResult = (item: Item, listId: number) => {
    setCurrentScreen({ type: 'result', item, listId });
  };

  // リスト詳細に戻る
  const handleBackToDetail = (listId: number) => {
    setCurrentScreen({ type: 'detail', listId });
  };

  // 画面に応じたコンポーネントを表示
  return (
    <div className="app">
      {currentScreen.type === 'lists' && (
        <ListsPage onSelectList={handleSelectList} />
      )}
      
      {currentScreen.type === 'detail' && (
        <ListDetailPage 
          listId={currentScreen.listId}
          onBack={handleBackToLists}
          onRandomSelect={(item) => handleShowResult(item, currentScreen.listId)}
        />
      )}
      
      {currentScreen.type === 'result' && (
        <ResultPage 
          item={currentScreen.item}
          onBack={() => handleBackToDetail(currentScreen.listId)}
          onSelectAgain={() => handleBackToDetail(currentScreen.listId)}
        />
      )}
    </div>
  );
}

export default App;
