import { Item } from '../types';
import './ResultPage.css';

interface ResultPageProps {
  item: Item;
  onBack: () => void;
  onSelectAgain: () => void;
}

/**
 * 選択結果表示画面
 */
export function ResultPage({ 
  item, 
  onBack, 
  onSelectAgain 
}: ResultPageProps) {
  return (
    <div className="result-page">
      <div className="result-container">
        <div className="result-header">
          <h2>🎉 選択結果</h2>
        </div>

        <div className="result-card">
          <h1 className="result-title">{item.title}</h1>
          {item.content && (
            <div className="result-content">
              <p>{item.content}</p>
            </div>
          )}
        </div>

        <div className="result-actions">
          <button 
            className="again-button"
            onClick={onSelectAgain}
          >
            🎲 もう一度選ぶ
          </button>
          <button 
            className="back-button"
            onClick={onBack}
          >
            リストに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
