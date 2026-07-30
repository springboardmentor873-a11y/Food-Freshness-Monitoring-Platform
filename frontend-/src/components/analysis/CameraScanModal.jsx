import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, AlertCircle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

/**
 * CameraScanModal — opens the device camera via getUserMedia and lets the
 * user capture a still frame as the analysis image. Gracefully degrades
 * with a permission-denied state if the camera is unavailable.
 */
export default function CameraScanModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [capturedUrl, setCapturedUrl] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCapturedUrl(null);
      setError(null);
      return;
    }

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setError("Camera access was denied or is unavailable on this device.");
      }
    }

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [isOpen]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-scan-${Date.now()}.jpg`, { type: "image/jpeg" });
      setCapturedUrl(URL.createObjectURL(blob));
      onCapture(file);
    }, "image/jpeg");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Camera Scan" size="lg">
      <div className="overflow-hidden rounded-2xl bg-slate-900">
        {error ? (
          <div className="flex h-72 flex-col items-center justify-center gap-2 px-6 text-center text-slate-300">
            <AlertCircle size={28} className="text-amber-400" />
            <p className="text-sm">{error}</p>
            <p className="text-xs text-slate-500">Use the drag & drop uploader instead.</p>
          </div>
        ) : capturedUrl ? (
          <img src={capturedUrl} alt="Captured frame" className="h-72 w-full object-cover sm:h-96" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="h-72 w-full object-cover sm:h-96" />
        )}
      </div>

      <div className="mt-5 flex justify-center gap-3">
        {capturedUrl ? (
          <>
            <Button variant="secondary" leftIcon={<RotateCcw size={16} />} onClick={() => setCapturedUrl(null)}>
              Retake
            </Button>
            <Button onClick={onClose}>Use This Photo</Button>
          </>
        ) : (
          !error && (
            <Button leftIcon={<Camera size={16} />} onClick={handleCapture}>
              Capture
            </Button>
          )
        )}
      </div>
    </Modal>
  );
}
