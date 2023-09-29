import { api } from "@/lib/axios";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import {
  CheckCircledIcon,
  FilePlusIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type Status = "waiting" | "converting" | "uploading" | "generating" | "success";

const statusMessages = {
  waiting: "Carregar vídeo",
  converting: "Convertendo...",
  generating: "Transcrevendo...",
  uploading: "Carregando...",
  success: "Sucesso!",
};

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void;
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;
    if (!files) {
      return;
    }
    const selectedFile = files[0];
    setVideoFile(selectedFile);
  }

  async function convertVideoToAudio(video: File) {
    console.log("Convertion started");

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // ffmpeg.on('log', log => {
    //   console.log(log)
    // })

    ffmpeg.on("progress", (progress) => {
      console.log(
        "Convertion progress: " + Math.round(progress.progress * 100) + "%"
      );
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mp3" });
    const audioFile = new File([audioFileBlob], "output.mp3", {
      type: "audio/mpeg",
    });

    console.log("Finished converting");

    return audioFile;
  }

  async function handleVideoUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;
    if (!videoFile) {
      return;
    }

    setStatus("converting");

    //Converte o vídeo em áudio
    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();
    data.append("file", audioFile);

    setStatus("uploading");

    const response = await api.post("/videos", data);
    const videoId = response.data.video.id;

    setStatus("generating");

    const transcriptionResponse = await api.post(
      `/videos/${videoId}/transcription`,
      {
        prompt,
      }
    );
    setStatus("success");
    props.onVideoUploaded(videoId);
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form onSubmit={handleVideoUpload} className="space-y-6">
      <label
        htmlFor="video"
        className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 relative"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className=" pointer-events-none absolute inset-0 rounded-lg"
          />
        ) : (
          <>
            <FilePlusIcon className="w-6 h-6" />
            Selecione um vídeo
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className=" sr-only"
        onChange={handleFileSelected}
      />
      <Separator orientation="horizontal" className="w-full h-px bg-zinc-500" />
      <div className="space-y-2">
        <Label htmlFor="transcription_input" className="text-xl">
          Prompt de transcrição
        </Label>
        <Textarea
          ref={promptInputRef}
          id="transcription_input"
          className="resize-none p-4 leading-relaxed"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula"
        />
      </div>
      <Button
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
        disabled={status !== "waiting"}
        data-success={status === "success"}
      >
        {status === "waiting" ? (
          <>
            Carregar vídeo
            <UploadIcon className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            {statusMessages[status]}
            {status === "success" ? (
              <CheckCircledIcon className="w-4 h-4 ml-1" />
            ) : (
              <></>
            )}
          </>
        )}
      </Button>
    </form>
  );
}
