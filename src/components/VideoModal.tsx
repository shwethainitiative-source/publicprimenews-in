import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoModalProps {
  video: {
    title: string;
    youtubeUrl?: string;
    youtube_url?: string;
  } | null;
  onClose: () => void;
}

function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
}

const VideoModal = ({ video, onClose }: VideoModalProps) => {
  if (!video) return null;

  return (
    <Dialog open={!!video} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-base font-bold">{video.title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src={getYoutubeEmbedUrl(video.youtubeUrl || video.youtube_url || "")}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
