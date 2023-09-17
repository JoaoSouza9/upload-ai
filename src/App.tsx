import {
  CheckCircledIcon,
  FilePlusIcon,
  GitHubLogoIcon,
  MagicWandIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex item-center justify-between border-b">
        <h1 className="text-xl font-bold">Upload.AI</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 🤍 no NLW da Rocketseat
          </span>
          <Separator orientation="vertical" className="h-6 w-0.5 bg-zinc-500" />
          <Button variant="outline">
            <GitHubLogoIcon className="mr-2 h-4 w-4" /> Github
          </Button>
        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {" "}
            Lembre-se: você pode utilizar a variável{" "}
            <code className="text-violet-400">
              &#123;transcription&#125;
            </code>{" "}
            no seu prompt para adicionar o conteúdo da transcrição do vídeo
            selecionado.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
            >
              <FilePlusIcon className="w-6 h-6" />
              Selecione um vídeo
            </label>
            <input
              type="file"
              id="video"
              accept="video/mp4"
              className=" sr-only"
            />
            <Separator
              orientation="horizontal"
              className="w-full h-px bg-zinc-500"
            />
            <div className="space-y-2">
              <Label htmlFor="transcription_input" className="text-xl">
                Prompt de transcrição
              </Label>
              <Textarea
                id="transcription_input"
                className="resize-none p-4 leading-relaxed"
                placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula"
              />
            </div>
            {/* <Button
              type="submit"
              className="border flex rounded-md w-full justify-center items-center"
            >
              Sucesso!
              <CheckCircledIcon className="w-4 h-4 ml-1" />
            </Button> */}
            <Button type="submit" className="w-full">
              Carregar vídeo
              <UploadIcon className="w-4 h-4 ml-1" />
            </Button>
          </form>
          <Separator
            orientation="horizontal"
            className="w-full h-0.5 bg-zinc-500"
          />
          <form className="w-80 space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seelecione um prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube-description">
                    Descrição Youtube
                  </SelectItem>
                  <SelectItem value="youtube-title">Título Youtube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                  <SelectItem value="dark">GPT 3.5-turbo 16k</SelectItem>
                  <SelectItem value="system">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa opção em breve
              </span>
            </div>
            <Separator
              orientation="horizontal"
              className="w-full h-px bg-zinc-500"
            />
            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                defaultValue={[0.5]}
                max={1}
                step={0.1}
                className=" cursor-pointer"
              />
              <span className="block text-xs text-muted-foreground italic">
                Valores mais altos tendem a deixar o resultado mais criativo e
                com possíveis erros
              </span>
            </div>
            <Separator />
            <Button type="submit" className="w-full">
              Executar
              <MagicWandIcon className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
