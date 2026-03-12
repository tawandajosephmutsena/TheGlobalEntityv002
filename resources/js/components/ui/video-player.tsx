"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "relative w-full h-1 bg-white/20 rounded-full cursor-pointer",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

// ─── YouTube / Vimeo helpers ───

/** Extract the YouTube video ID from any common YouTube URL format */
const getYouTubeId = (url: string): string | null => {
  if (url.includes("youtu.be")) {
    return url.split("youtu.be/")[1]?.split(/[?&#]/)[0] || null;
  }
  if (url.includes("youtube.com")) {
    const match = url.match(/[?&]v=([^&#]+)/);
    return match?.[1] || null;
  }
  return null;
};

/** Extract the Vimeo video ID */
const getVimeoId = (url: string): string | null => {
  if (url.includes("vimeo.com")) {
    return url.split("vimeo.com/")[1]?.split(/[?&#]/)[0] || null;
  }
  return null;
};

const getVideoType = (url: string): "youtube" | "vimeo" | "direct" => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  return "direct";
};

/**
 * Get a YouTube thumbnail URL without touching any YouTube embed/API.
 * This is a plain image CDN and does NOT trigger bot checks.
 */
const getYouTubeThumbnail = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

/**
 * Build the embed URL — only called AFTER the user clicks play.
 * Uses standard youtube.com/embed (not youtube-nocookie.com which aggressively blocks embeds).
 * Does NOT use autoplay=1 to avoid triggering YouTube's bot detection.
 */
const getEmbedUrl = (url: string): string => {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&iv_load_policy=3`;
  }
  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }
  return url;
};

/** Get the direct watch URL for opening in a new tab as a fallback */
const getWatchUrl = (url: string): string => {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://www.youtube.com/watch?v=${ytId}`;
  return url;
};


// ─── Embed Player (YouTube / Vimeo) ───
// Shows a static thumbnail with a play button.
// Only loads the actual iframe AFTER the user clicks play.
const EmbedPlayer = ({ src }: { src: string }) => {
  const [activated, setActivated] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const videoType = getVideoType(src);
  const ytId = getYouTubeId(src);

  // For YouTube we can get a thumbnail without loading the iframe.
  // For Vimeo we show a minimal dark preview (Vimeo thumbnails require API call).
  const thumbnailUrl = videoType === "youtube" && ytId
    ? getYouTubeThumbnail(ytId)
    : null;

  if (activated && !embedFailed) {
    // User has clicked play — now we load the actual iframe
    return (
      <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-black shadow-[0_0_20px_rgba(0,0,0,0.2)] aspect-video">
        <iframe
          title="Video Player"
          src={getEmbedUrl(src)}
          className="w-full h-full"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => setEmbedFailed(true)}
        />
        {/* Fallback link always visible at bottom */}
        <a
          href={getWatchUrl(src)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 z-10 text-xs text-white/60 hover:text-white bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
        >
          Watch on YouTube ↗
        </a>
      </div>
    );
  }

  // Embed failed — show a direct link to YouTube
  if (embedFailed) {
    return (
      <motion.div
        className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-black shadow-[0_0_20px_rgba(0,0,0,0.2)] aspect-video cursor-pointer group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {thumbnailUrl && (
          <img src={thumbnailUrl} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4">
          <p className="text-white/70 text-sm">Embed unavailable</p>
          <a
            href={getWatchUrl(src)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors shadow-lg"
          >
            <Play className="w-5 h-5 fill-white" />
            Watch on YouTube
          </a>
        </div>
      </motion.div>
    );
  }

  // Pre-click state — show thumbnail + play button, NO iframe loaded
  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-black shadow-[0_0_20px_rgba(0,0,0,0.2)] aspect-video cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => setActivated(true)}
    >
      {/* Thumbnail background */}
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1 border border-white/30 text-white shadow-2xl"
        >
          <Play className="w-10 h-10 fill-white" />
        </motion.div>
      </div>

      {/* Platform badge */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs font-medium uppercase tracking-wider">
        {videoType === "youtube" ? "YouTube" : "Vimeo"}
      </div>
    </motion.div>
  );
};


// ─── Direct Video Player (uploaded files) ───
const DirectVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  // Generate a poster from the first frame of the video
  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.muted = true;
    video.src = src;

    const handleLoaded = () => {
      video.currentTime = 0.1;
    };
    const handleSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setPosterUrl(canvas.toDataURL("image/jpeg", 0.7));
        }
      } catch {
        // CORS or other failure — fall back to no poster
      }
      video.remove();
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("seeked", handleSeeked);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("seeked", handleSeeked);
      video.remove();
    };
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowOverlay(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = value / 100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const prog =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isFinite(prog) ? prog : 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current && videoRef.current.duration) {
      const time = (value / 100) * videoRef.current.duration;
      if (isFinite(time)) {
        videoRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const setSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full"
        preload="metadata"
        poster={posterUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        src={src}
        onClick={togglePlay}
        onEnded={() => {
          setIsPlaying(false);
          setShowOverlay(true);
        }}
        onPlay={() => {
          setIsPlaying(true);
          setShowOverlay(false);
        }}
        onPause={() => {
          setIsPlaying(false);
          setShowOverlay(true);
        }}
      />

      <AnimatePresence>
        {!isPlaying && showOverlay && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={togglePlay}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1 border border-white/30 text-white shadow-2xl"
            >
              <Play className="w-10 h-10 fill-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-0 mx-auto max-w-xl left-0 right-0 p-4 m-2 bg-[#11111198] backdrop-blur-md rounded-2xl"
            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 20, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "circInOut", type: "spring" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white text-sm">
                {formatTime(currentTime)}
              </span>
              <CustomSlider
                value={progress}
                onChange={handleSeek}
                className="flex-1"
              />
              <span className="text-white text-sm">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={togglePlay}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#111111d1] hover:text-white"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
                <div className="flex items-center gap-x-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      onClick={toggleMute}
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-[#111111d1] hover:text-white"
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : volume > 0.5 ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <Volume1 className="h-5 w-5" />
                      )}
                    </Button>
                  </motion.div>

                  <div className="w-24">
                    <CustomSlider
                      value={volume * 100}
                      onChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    key={speed}
                  >
                    <Button
                      onClick={() => setSpeed(speed)}
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "text-white hover:bg-[#111111d1] hover:text-white",
                        playbackSpeed === speed && "bg-[#111111d1]"
                      )}
                    >
                      {speed}x
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// ─── Main VideoPlayer ───
const VideoPlayer = ({ src }: { src: string }) => {
  const videoType = getVideoType(src);

  if (videoType !== "direct") {
    return <EmbedPlayer src={src} />;
  }

  return <DirectVideoPlayer src={src} />;
};

export default VideoPlayer;
