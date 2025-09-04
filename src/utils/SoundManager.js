// 音效管理器
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.init();
  }

  init() {
    try {
      // 创建音频上下文
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('音频上下文创建失败:', e);
    }
  }

  // 创建音效
  createBeep(frequency, duration, type = 'sine') {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    return oscillator;
  }

  // 播放吃食物音效
  playEatSound() {
    this.createBeep(800, 0.1, 'square');
  }

  // 播放游戏结束音效
  playGameOverSound() {
    // 播放一系列下降音调
    setTimeout(() => this.createBeep(300, 0.3), 0);
    setTimeout(() => this.createBeep(250, 0.3), 100);
    setTimeout(() => this.createBeep(200, 0.5), 200);
  }

  // 播放按键音效
  playKeySound() {
    this.createBeep(400, 0.05, 'square');
  }

  // 播放开始游戏音效
  playStartSound() {
    this.createBeep(600, 0.1);
    setTimeout(() => this.createBeep(800, 0.1), 100);
    setTimeout(() => this.createBeep(1000, 0.2), 200);
  }
}

export default SoundManager;