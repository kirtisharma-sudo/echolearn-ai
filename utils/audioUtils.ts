export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- TTS Audio Decoding Utilities ---

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeRawPCM(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

let currentAudioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export const stopAudio = () => {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {
      // Ignore errors if already stopped
    }
    currentSource = null;
  }
  if (currentAudioContext) {
    currentAudioContext.close();
    currentAudioContext = null;
  }
};

export const playRawAudio = async (base64String: string, onEnded?: () => void) => {
  // Stop any currently playing audio
  stopAudio();

  const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
  currentAudioContext = new AudioContextClass({ sampleRate: 24000 });

  try {
    const bytes = decodeBase64(base64String);
    const audioBuffer = await decodeRawPCM(bytes, currentAudioContext);
    
    const source = currentAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(currentAudioContext.destination);
    
    source.onended = () => {
      if (onEnded) onEnded();
      currentSource = null;
    };
    
    currentSource = source;
    source.start(0);
  } catch (error) {
    console.error("Error playing audio:", error);
    if (onEnded) onEnded(); // Ensure state resets even on error
  }
};