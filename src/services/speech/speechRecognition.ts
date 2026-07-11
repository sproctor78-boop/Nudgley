export interface SpeechRecognitionService { isSupported(): boolean; listen(onInterim: (text: string) => void): Promise<string>; stop(): void; }

type RecognitionCtor = new () => SpeechRecognition;
type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionEvent = { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>; };

declare global { interface Window { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor; } }

export class BrowserSpeechRecognitionService implements SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  isSupported(): boolean { return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition); }
  listen(onInterim: (text: string) => void): Promise<string> {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return Promise.reject(new Error('Speech recognition unavailable'));
    return new Promise((resolve, reject) => {
      let finalText = '';
      this.recognition = new Ctor();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-GB';
      this.recognition.onresult = event => {
        let interim = '';
        for (let i = 0; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result.isFinal) finalText += `${result[0].transcript} `;
          else interim += result[0].transcript;
        }
        onInterim(`${finalText}${interim}`.trim());
      };
      this.recognition.onerror = () => reject(new Error('Speech recognition failed'));
      this.recognition.onend = () => resolve(finalText.trim());
      this.recognition.start();
    });
  }
  stop(): void { this.recognition?.stop(); }
}
