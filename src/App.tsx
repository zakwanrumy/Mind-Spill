import React, { useState, useEffect } from 'react';
import { Download, Eraser, Sparkles, Menu, X, PenTool, Music, ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';

const prompts = [
  "What's something you wish others knew about you?",
  "Name one thing that brought you joy this week.",
  "What's a small victory you achieved today?",
  "If you could tell your younger self one thing, what would it be?",
  "What's a dream you've been putting off?",
];

const playlists = [
  "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ",
  "https://open.spotify.com/embed/playlist/37i9dQZF1DX9sIqqvKsjG8",
  "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn",
];

function App() {
  const [entry, setEntry] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSpotify, setShowSpotify] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [spotifyPlayer, setSpotifyPlayer] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    setWordCount(entry.trim().split(/\s+/).filter(Boolean).length);
  }, [entry]);

  useEffect(() => {
    const player = document.querySelector<HTMLIFrameElement>('.spotify-iframe');
    if (player) {
      setSpotifyPlayer(player);
      // Initialize volume
      player.contentWindow?.postMessage({ command: 'volume', value: volume / 100 }, '*');
    }
  }, [showSpotify]);

  const generatePrompt = () => {
    setPrompt('');
    setTimeout(() => {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setPrompt(randomPrompt);
    }, 100);
  };

  const downloadEntry = () => {
    const element = document.createElement('a');
    const timestamp = new Date().toLocaleString().replace(/[/:]/g, '-');
    const content = `${prompt ? `Prompt: ${prompt}\n\n` : ''}${entry}\n\nWritten on ${timestamp}\nPage ${currentPage}`;
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `mindspill-${new Date().toISOString().split('T')[0]}-page${currentPage}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearEntry = () => {
    if (entry && window.confirm('Are you sure you want to clear your entry?')) {
      setEntry('');
      setPrompt('');
    }
  };

  const nextPage = () => {
    if (entry && !window.confirm('Moving to the next page will clear your current entry. Continue?')) {
      return;
    }
    setCurrentPage(prev => prev + 1);
    setEntry('');
    setPrompt('');
  };

  const previousPage = () => {
    if (currentPage > 1) {
      if (entry && !window.confirm('Moving to the previous page will clear your current entry. Continue?')) {
        return;
      }
      setCurrentPage(prev => prev - 1);
      setEntry('');
      setPrompt('');
    }
  };

  const toggleSpotify = () => {
    setShowSpotify(!showSpotify);
  };

  const changePlaylist = () => {
    setCurrentPlaylist((prev) => (prev + 1) % playlists.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
    if (spotifyPlayer?.contentWindow) {
      spotifyPlayer.contentWindow.postMessage({ command: 'volume', value: newVolume / 100 }, '*');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (spotifyPlayer?.contentWindow) {
      spotifyPlayer.contentWindow.postMessage({ command: 'volume', value: isMuted ? volume / 100 : 0 }, '*');
    }
  };

  return (
    <div className="min-h-screen bg-paper paper-texture">
      {/* Header */}
      <header className="px-6 py-4 bg-white/50 backdrop-blur-sm shadow-soft sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className={`text-3xl font-cormorant font-semibold flex items-center gap-2 ${isLoaded ? 'animate-slide-in' : 'opacity-0'}`}>
            <PenTool className="text-accent-primary" />
            MindSpill
          </h1>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden hover:bg-accent-primary/10 p-2 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-primary/80">
            {['Journal', 'Prompts', 'About', 'Contact'].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`hover:text-accent-cta transition-colors hover-lift ${
                  isLoaded ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col space-y-4 text-primary/80 animate-fade-in">
            {['Journal', 'Prompts', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-accent-cta transition-colors hover-lift"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-accent-primary/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-cormorant mb-4 ${
            isLoaded ? 'animate-fade-in' : 'opacity-0'
          }`}>
            A quiet space for your thoughts
          </h2>
          <p className={`text-muted text-lg mb-8 ${
            isLoaded ? 'animate-fade-in' : 'opacity-0'
          }`} style={{ animationDelay: '200ms' }}>
            No accounts. No judgments.
          </p>
          <a 
            href="#write"
            className={`inline-block px-8 py-3 bg-accent-secondary hover:bg-accent-cta transition-colors rounded-full text-primary font-medium shadow-soft hover-lift ${
              isLoaded ? 'animate-scale-in' : 'opacity-0'
            }`}
            style={{ animationDelay: '400ms' }}
          >
            Start Writing
          </a>
        </div>
      </section>

      {/* Journal Section */}
      <main className="px-6 py-12" id="write">
        <div className="max-w-4xl mx-auto">
          {prompt && (
            <div className="mb-6 p-4 bg-accent-primary/20 rounded-lg prompt-animation">
              <p className="text-primary/80 italic">{prompt}</p>
            </div>
          )}

          <div className="page-container relative">
            <div className="page">
              <div className="relative">
                <textarea
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Type anything that's on your mind..."
                  className="w-full p-6 bg-white/50 rounded-lg shadow-soft journal-area focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none transition-shadow duration-300"
                  rows={10}
                />
                <div className="absolute bottom-4 right-4 text-sm text-muted flex items-center gap-4">
                  <span>{wordCount} words</span>
                  <span className="page-number">Page {currentPage}</span>
                </div>
                <div className="page-corner"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={generatePrompt}
              className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary/80 transition-all rounded-full text-primary font-medium shadow-soft hover-lift"
            >
              <Sparkles size={20} />
              Need a spark?
            </button>

            <button
              onClick={downloadEntry}
              disabled={!entry}
              className={`flex items-center gap-2 px-6 py-3 transition-all rounded-full font-medium shadow-soft hover-lift
                ${entry ? 'bg-accent-secondary hover:bg-accent-cta text-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <Download size={20} />
              Download Entry
            </button>

            <button
              onClick={clearEntry}
              disabled={!entry}
              className={`flex items-center gap-2 px-6 py-3 transition-all rounded-full font-medium shadow-soft hover-lift
                ${entry ? 'bg-white hover:bg-accent-cta/10 text-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <Eraser size={20} />
              Clear Page
            </button>

            <button
              onClick={toggleSpotify}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-accent-cta/10 transition-all rounded-full text-primary font-medium shadow-soft hover-lift"
            >
              <Music size={20} />
              {showSpotify ? 'Hide Music' : 'Show Music'}
            </button>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 transition-all rounded-full font-medium
                ${currentPage > 1 ? 'text-primary hover:bg-accent-cta/10' : 'text-gray-400 cursor-not-allowed'}`}
            >
              <ChevronLeft size={20} />
              Previous Page
            </button>

            <button
              onClick={nextPage}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-accent-cta/10 transition-all rounded-full font-medium"
            >
              Next Page
              <ChevronRight size={20} />
            </button>
          </div>

          {showSpotify && (
            <div className="mt-8 spotify-player">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-cormorant">Writing Ambience</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-primary hover:text-accent-cta transition-colors">
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-2 bg-accent-primary/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={changePlaylist}
                    className="text-sm text-accent-primary hover:text-accent-cta transition-colors"
                  >
                    Change Playlist
                  </button>
                </div>
              </div>
              <iframe
                className="spotify-iframe"
                src={`${playlists[currentPlaylist]}&volume=${volume}`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Player"
              ></iframe>
            </div>
          )}
        </div>
      </main>

      {/* About Section */}
      <section className="px-6 py-16 bg-white/50" id="about">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-cormorant mb-6">About MindSpill</h2>
          <p className="text-muted text-lg leading-relaxed">
            We believe in quiet moments, slow thoughts, and digital privacy. 
            MindSpill is your personal space to reflect, process, and breathe. 
            No tracking. No storage. Just you and your thoughts.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-primary text-paper/80">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-2">© 2025 MindSpill – All thoughts belong to you.</p>
          <p className="text-sm">No tracking. No storage. Just a space to breathe.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;