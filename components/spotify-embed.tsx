"use client"

interface SpotifyEmbedProps {
  trackUrl: string
}

export function SpotifyEmbed({ trackUrl }: SpotifyEmbedProps) {
  // Extract Spotify track ID from URL
  const getTrackId = (url: string) => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  const trackId = getTrackId(trackUrl)

  if (!trackId) {
    return (
      <div className="p-6 bg-secondary rounded-2xl text-center">
        <p className="text-muted-foreground text-sm">Invalid Spotify track URL</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center my-8">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-2xl"
      />
    </div>
  )
}
