import { useState } from 'react';
import { Download, Youtube, Instagram, Twitter, Facebook, Linkedin, Twitch, Link2, Ghost, Hash, PlaySquare, MessageSquare, Camera, AtSign, Globe, Cloud, PenTool, HelpCircle, MessageCircle, Send, Eye, Users, Briefcase, Home, Mic, Play, ShieldAlert } from 'lucide-react';
import { downloadMedia } from './services/api';
import './App.css';

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C' },
  { id: 'tiktok', name: 'TikTok', icon: Hash, color: '#00F2FE' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#1DA1F2' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'pinterest', name: 'Pinterest', icon: Ghost, color: '#E60023' },
  { id: 'reddit', name: 'Reddit', icon: Ghost, color: '#FF4500' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, color: '#9146FF' },
  { id: 'vimeo', name: 'Vimeo', icon: PlaySquare, color: '#1AB7EA' },
  { id: 'snapchat', name: 'Snapchat', icon: Ghost, color: '#FFFC00' },
  { id: 'discord', name: 'Discord', icon: MessageSquare, color: '#5865F2' },
  { id: 'bereal', name: 'BeReal', icon: Camera, color: '#FFFFFF' },
  { id: 'threads', name: 'Threads', icon: AtSign, color: '#FFFFFF' },
  { id: 'mastodon', name: 'Mastodon', icon: Hash, color: '#2B90D9' },
  { id: 'bluesky', name: 'Bluesky', icon: Cloud, color: '#0085FF' },
  { id: 'tumblr', name: 'Tumblr', icon: PenTool, color: '#36465D' },
  { id: 'quora', name: 'Quora', icon: HelpCircle, color: '#B92B27' },
  { id: 'wechat', name: 'WeChat', icon: MessageCircle, color: '#09B83E' },
  { id: 'line', name: 'LINE', icon: MessageCircle, color: '#00C300' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: '#0088cc' },
  { id: 'signal', name: 'Signal', icon: MessageCircle, color: '#3A76F0' },
  { id: 'kakaotalk', name: 'KakaoTalk', icon: MessageSquare, color: '#FFE812' },
  { id: 'weibo', name: 'Weibo', icon: Eye, color: '#DF2029' },
  { id: 'vk', name: 'VK', icon: Users, color: '#4680C2' },
  { id: 'xing', name: 'Xing', icon: Briefcase, color: '#026466' },
  { id: 'nextdoor', name: 'Nextdoor', icon: Home, color: '#8ED500' },
  { id: 'clubhouse', name: 'Clubhouse', icon: Mic, color: '#F5DAA3' },
  { id: 'dailymotion', name: 'Dailymotion', icon: Play, color: '#0066DC' },
  { id: 'meetup', name: 'Meetup', icon: Users, color: '#ED1C40' },
];

const ADULT_PLATFORMS = [
  {
    id: 'pornhub',
    name: 'Pornhub',
    color: '#ff9000',
    accentColor: '#ff9000',
    description: 'Download videos from Pornhub',
    placeholder: 'https://www.pornhub.com/view_video.php?viewkey=...',
  },
  {
    id: 'xvideos',
    name: 'XVideos',
    color: '#1a9e1a',
    accentColor: '#1a9e1a',
    description: 'Download videos from XVideos',
    placeholder: 'https://www.xvideos.com/video...',
  },
  {
    id: 'xhamster',
    name: 'xHamster',
    color: '#f5a623',
    accentColor: '#f5a623',
    description: 'Download videos from xHamster',
    placeholder: 'https://xhamster.com/videos/...',
  },
];

function AdultPlatformCard({ platform }) {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsDownloading(true);
    setDownloadSuccess(false);
    setErrorMessage('');

    try {
      const result = await downloadMedia(url, format);

      if (result.status === 'error') {
        throw new Error(result.text || 'Failed to download media for this URL.');
      }

      if (result.status === 'redirect' || result.status === 'stream') {
        window.open(result.url, '_blank');
      } else if (result.status === 'picker') {
        window.open(result.picker[0].url, '_blank');
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
      setUrl('');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'An error occurred fetching the download link.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="adult-platform-card glass-panel" style={{ '--platform-color': platform.accentColor }}>
      <div className="adult-platform-header">
        <div className="adult-platform-badge" style={{ background: platform.color }}>
          <span>{platform.name[0]}</span>
        </div>
        <div>
          <h3 className="adult-platform-name" style={{ color: platform.color }}>{platform.name}</h3>
          <p className="adult-platform-desc">{platform.description}</p>
        </div>
      </div>

      <form onSubmit={handleDownload} className="adult-download-form">
        <div className="input-group">
          <Link2 className="input-icon" size={20} />
          <input
            type="url"
            className="url-input"
            placeholder={platform.placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div className="adult-form-actions">
          <div className="format-options">
            {['mp4', 'mp3'].map((f) => (
              <button
                key={f}
                type="button"
                className={`format-btn glass-panel ${format === f ? 'active' : ''}`}
                onClick={() => setFormat(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="action-btn adult-action-btn"
            disabled={!url || isDownloading}
            style={{ '--btn-color': platform.color }}
          >
            {isDownloading ? (
              <>
                <Download className="loading-spinner" size={20} />
                Processing...
              </>
            ) : downloadSuccess ? (
              <>
                <Download size={20} />
                Ready!
              </>
            ) : (
              <>
                <Download size={20} />
                Download
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="error-message glass-panel">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [adultsEnabled, setAdultsEnabled] = useState(false);
  const [showAgeConfirm, setShowAgeConfirm] = useState(false);

  const handleAdultToggle = () => {
    if (!adultsEnabled) {
      setShowAgeConfirm(true);
    } else {
      setAdultsEnabled(false);
    }
  };

  const confirmAge = () => {
    setAdultsEnabled(true);
    setShowAgeConfirm(false);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url || !selectedPlatform) return;

    setIsDownloading(true);
    setDownloadSuccess(false);
    setErrorMessage('');

    try {
      const result = await downloadMedia(url, format);

      if (result.status === 'error') {
        throw new Error(result.text || 'Failed to download media for this URL.');
      }

      if (result.status === 'redirect' || result.status === 'stream') {
        window.open(result.url, '_blank');
      } else if (result.status === 'picker') {
        window.open(result.picker[0].url, '_blank');
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
      setUrl('');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'An error occurred fetching the download link.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Age Confirmation Modal */}
      {showAgeConfirm && (
        <div className="age-modal-overlay">
          <div className="age-modal glass-panel">
            <div className="age-modal-icon">🔞</div>
            <h2 className="age-modal-title">Age Verification</h2>
            <p className="age-modal-text">
              This section contains adult content (18+). By continuing, you confirm that you are at least <strong>18 years old</strong> and it is legal to access such content in your jurisdiction.
            </p>
            <div className="age-modal-buttons">
              <button className="age-confirm-btn" onClick={confirmAge}>
                I am 18+ — Enter
              </button>
              <button className="age-cancel-btn glass-panel" onClick={() => setShowAgeConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="header animate-float">
        {/* 18+ Toggle */}
        <div className="adult-toggle-wrapper">
          <button
            className={`adult-toggle-btn ${adultsEnabled ? 'active' : ''}`}
            onClick={handleAdultToggle}
            title={adultsEnabled ? 'Disable 18+ section' : 'Enable 18+ section'}
          >
            <ShieldAlert size={16} />
            <span>18+</span>
            <div className={`toggle-pill ${adultsEnabled ? 'on' : ''}`}>
              <div className="toggle-thumb" />
            </div>
          </button>
        </div>

        <h1 className="title">
          All<span className="text-gradient">Downloader</span>
        </h1>
        <p className="subtitle">
          Download videos, audio, and images from your favorite platforms
        </p>
      </header>

      <main>
        <div className="platform-grid">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isActive = selectedPlatform === platform.id;
            return (
              <div
                key={platform.id}
                className={`glass-panel platform-card ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <div className="platform-icon" style={{ color: isActive ? '#fff' : platform.color }}>
                  <Icon size={24} />
                </div>
                <span className="platform-name">{platform.name}</span>
              </div>
            );
          })}
        </div>

        {selectedPlatform && (
          <section className="download-section">
            <form className="glass-panel download-form" onSubmit={handleDownload}>
              <div className="input-group">
                <Link2 className="input-icon" size={24} />
                <input
                  type="url"
                  className="url-input"
                  placeholder={`Paste ${PLATFORMS.find(p => p.id === selectedPlatform)?.name} link here...`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="format-options">
                {['mp4', 'mp3', 'png'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`format-btn glass-panel ${format === f ? 'active' : ''}`}
                    onClick={() => setFormat(f)}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="action-btn"
                disabled={!url || isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Download className="loading-spinner" size={24} />
                    Processing...
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Download size={24} />
                    Download Ready!
                  </>
                ) : (
                  <>
                    <Download size={24} />
                    Download
                  </>
                )}
              </button>
            </form>

            {errorMessage && (
              <div className="error-message glass-panel" style={{ marginTop: '16px', padding: '16px', color: '#ff4d4f', border: '1px solid #ff4d4f40' }}>
                {errorMessage}
              </div>
            )}
          </section>
        )}

        {/* 18+ Adult Section */}
        {adultsEnabled && (
          <section className="adult-section">
            <div className="adult-section-header">
              <div className="adult-section-badge">🔞 18+</div>
              <div>
                <h2 className="adult-section-title">Adult Content Downloader</h2>
                <p className="adult-section-subtitle">
                  Download videos from the world's most popular adult platforms
                </p>
              </div>
            </div>

            <div className="adult-platforms-grid">
              {ADULT_PLATFORMS.map((platform) => (
                <AdultPlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
