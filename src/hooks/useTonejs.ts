import { openDB, DBSchema, IDBPDatabase } from "idb";
import * as Tone from "tone";
import { ToneAudioBuffer } from "tone";

// // Database Configuration
// const idbConfig = {
//     databaseName: "nusic-covers",
//     version: 1,
//     stores: [
//         {
//             name: "covers",
//             id: { keyPath: "id" },
//             indices: [
//                 { name: "id", keyPath: "id", options: { unique: true } },
//                 { name: "data", keyPath: "data", options: { unique: true } },
//             ],
//         },
//     ],
// };

interface Cover {
  id: string;
  data: Float32Array;
}

interface CoversDB extends DBSchema {
  covers: {
    key: string;
    value: Cover;
    indexes: { id: string };
  };
}

// Global variables
let instrPlayerRef: Tone.Player | null = null;
let isToneInitialized: boolean = false;
let isMuted: boolean = false;
let isTonePlaying: boolean = false;
let toneLoadingForSection: string | null = null;
let isEnded: boolean = false;
const downloadObj: { [key: string]: ToneAudioBuffer } = {};
const playersRef: { [key: string]: Tone.Player } = {}; // For keeping track of players
let currentlyPlayingUrl: string = "";
let db: Promise<IDBPDatabase<CoversDB>> | null = null;

const initializeDB = async () => {
  db = openDB<CoversDB>("nusic-covers", 1, {
    upgrade(db) {
      const store = db.createObjectStore("covers", {
        keyPath: "id",
      });
      store.createIndex("id", "id", { unique: true });
    },
  });
  return db;
};

const addToDB = async (id: string, data: Float32Array) => {
  if (!db) await initializeDB();
  const dbInstance = await db!;
  await dbInstance.put("covers", { id, data });
};

const getFromDB = async (id: string): Promise<Float32Array | undefined> => {
  if (!db) await initializeDB();
  const dbInstance = await db!;
  const record = await dbInstance.get("covers", id);
  return record?.data;
};

const downloadAudioFiles = async (
  urls: string[],
  onProgress: (progress: number) => void
) => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (!downloadObj[url]) {
      const dataArray = await getFromDB(url);
      if (dataArray) {
        console.log("From Indexed DB", url);
        const bf = Tone.Buffer.fromArray(dataArray);
        downloadObj[url] = bf;
      } else {
        console.log("Downloading", url);
        const buffer = await new Promise<ToneAudioBuffer>((res) => {
          const audioBuffer = new Tone.Buffer(url);
          audioBuffer.onload = (bf) => {
            addToDB(url, bf.toArray() as Float32Array);
            res(bf);
          };
        });
        downloadObj[url] = buffer;
        addToDB(url, buffer.toArray() as Float32Array);
      }
    }
    // Update progress
    const progress = ((i + 1) / urls.length) * 100;
    onProgress(progress);
  }
};
const getToneCurrentTime = () => {
  return Tone.Transport.seconds;
};
const initializeTone = async () => {
  if (!isToneInitialized) {
    isToneInitialized = true;
    await Tone.start();
    console.log("context started");
    setEvents();
    await initializeDB();
  }
};

const setEvents = () => {
  Tone.Transport.on("start", () => {
    console.log("Tone Started");
    isTonePlaying = true;
  });
  Tone.Transport.on("stop", () => {
    console.log("Tone Stopped");
    isTonePlaying = false;
  });
  Tone.Transport.on("pause", () => {
    console.log("Tone Paused");
    isTonePlaying = false;
  });
  Tone.Transport.on("loopEnd", () => {
    isEnded = true;
  });
};

const pausePlayer = () => {
  Tone.Transport.pause();
};

const playPlayer = () => {
  Tone.Transport.start();
};

const stopPlayer = () => {
  Tone.Transport.stop();
};

const marbleRaceOnlyInstrument = async (
  id: string,
  bpm: number,
  startOffset: number
) => {
  if (bpm) Tone.Transport.bpm.value = bpm;
  else Tone.Transport.bpm.dispose();
  await initializeTone();
  if (Tone.Transport.seconds) Tone.Transport.stop();
  if (instrPlayerRef) {
    instrPlayerRef.stop();
    instrPlayerRef.dispose();
    instrPlayerRef = null;
  }
  const instrDataArray: Tone.ToneAudioBuffer =
    downloadObj[`https://voxaudio.nusic.fm/covers/${id}/instrumental.mp3`];
  const instrPlayer = new Tone.Player(instrDataArray).sync().toDestination();
  instrPlayerRef = instrPlayer;
  const voicesUrls = Object.keys(downloadObj).slice(1);
  for (let i = 0; i < voicesUrls.length; i++) {
    const url = voicesUrls[i];
    playersRef[url] = new Tone.Player(downloadObj[url]).toDestination();
  }
  await Tone.loaded();
  instrPlayerRef.start();
  playersRef[voicesUrls[0]].start(undefined, startOffset);
  currentlyPlayingUrl = voicesUrls[0];
  Tone.Transport.start(undefined, startOffset);
};

const prepareVocalPlayers = async (urls: string[]) => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    playersRef[url] = new Tone.Player(downloadObj[url]).toDestination();
  }
};

const marbleRacePlayVocals = async (id: string, vId: string) => {
  const url = `https://voxaudio.nusic.fm/covers/${id}/${vId}.mp3`;
  if (currentlyPlayingUrl) {
    playersRef[currentlyPlayingUrl].stop();
    currentlyPlayingUrl = "";
  }
  if (url in playersRef) {
    currentlyPlayingUrl = url;
    playersRef[url].start(undefined, Tone.Transport.seconds);
  }
};

const stopAndDestroyPlayers = () => {
  if (instrPlayerRef) {
    instrPlayerRef.stop();
    instrPlayerRef.dispose();
    instrPlayerRef = null;
  }
  const downloadObjKeys = Object.keys(downloadObj);
  delete downloadObj[downloadObjKeys[0]];
  const voicesUrls = downloadObjKeys.slice(1);
  for (let i = 0; i < voicesUrls.length; i++) {
    const url = voicesUrls[i];
    if (playersRef[url]) {
      playersRef[url].stop();
      playersRef[url].dispose();
      delete playersRef[url];
      delete downloadObj[url];
    }
  }
  Tone.Transport.stop();
};

const getToneStatus = () => {
  return {
    isTonePlaying,
    isMuted,
    toneLoadingForSection,
  };
};

export {
  initializeTone,
  downloadAudioFiles,
  marbleRaceOnlyInstrument,
  marbleRacePlayVocals,
  pausePlayer,
  playPlayer,
  stopPlayer,
  getToneStatus,
  stopAndDestroyPlayers,
  getToneCurrentTime,
  prepareVocalPlayers,
};
