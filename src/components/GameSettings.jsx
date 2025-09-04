import React from 'react';
import './GameSettings.css';

const GameSettings = ({ isOpen, onClose, onDifficultyChange, currentDifficulty }) => {
  const difficulties = [
    { name: '简单', speed: 200, color: '#4CAF50' },
    { name: '普通', speed: 150, color: '#FF9800' },
    { name: '困难', speed: 100, color: '#F44336' },
    { name: '地狱', speed: 70, color: '#9C27B0' }
  ];

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h2>🎮 游戏设置</h2>
        
        <div className="difficulty-section">
          <h3>难度选择</h3>
          <div className="difficulty-grid">
            {difficulties.map((diff) => (
              <button
                key={diff.name}
                className={`difficulty-btn ${currentDifficulty === diff.speed ? 'active' : ''}`}
                style={{ '--accent-color': diff.color }}
                onClick={() => onDifficultyChange(diff.speed)}
              >
                <span className="difficulty-name">{diff.name}</span>
                <span className="difficulty-speed">速度: {Math.round((250 - diff.speed) / 10)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-info">
          <h3>📖 游戏说明</h3>
          <ul>
            <li>🏆 每吃一个食物得10分</li>
            <li>⚡ 每50分速度会自动增加</li>
            <li>🔄 使用方向键控制蛇的移动</li>
            <li>⏸️ 按空格键暂停/继续游戏</li>
            <li>💾 最高分会自动保存</li>
          </ul>
        </div>

        <button className="close-btn" onClick={onClose}>
          ✅ 确定
        </button>
      </div>
    </div>
  );
};

export default GameSettings;