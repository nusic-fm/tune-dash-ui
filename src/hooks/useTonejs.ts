// import { openDB, DBSchema, IDBPDatabase } from "idb";
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

// interface Cover {
//   id: string;
//   data: Float32Array;
// }

// interface CoversDB extends DBSchema {
//   covers: {
//     key: string;
//     value: Cover;
//     indexes: { id: string };
//   };
// }

// Global variables
let instrPlayerRef: Tone.Player | null = null;
let introPlayerRef: Tone.Player | null = null;
let isToneInitialized: boolean = false;
let isMuted: boolean = true;
let isTonePlaying: boolean = false;
let toneLoadingForSection: string | null = null;
let isEnded: boolean = false;
const downloadObj: { [key: string]: ToneAudioBuffer } = {};
const playersRef: { [key: string]: Tone.Player } = {}; // For keeping track of players
let currentlyPlayingUrl: string = "";
// let db: Promise<IDBPDatabase<CoversDB>> | null = null;

// const initializeDB = async () => {
//   db = openDB<CoversDB>("nusic-covers", 1, {
//     upgrade(db) {
//       const store = db.createObjectStore("covers", {
//         keyPath: "id",
//       });
//       store.createIndex("id", "id", { unique: true });
//     },
//   });
//   return db;
// };

// const addToDB = async (id: string, data: Float32Array) => {
//   if (!db) await initializeDB();
//   const dbInstance = await db!;
//   await dbInstance.put("covers", { id, data });
// };

// const getFromDB = async (id: string): Promise<Float32Array | undefined> => {
//   if (!db) await initializeDB();
//   const dbInstance = await db!;
//   const record = await dbInstance.get("covers", id);
//   return record?.data;
// };

const downloadAudioFiles = async (
  urls: string[],
  onProgress: (progress: number) => void
) => {
  // Delete all keys of downloadObj and free the memory
  Object.keys(downloadObj).forEach((key) => {
    if (urls.includes(key)) return;
    downloadObj[key].dispose();
    playersRef[key]?.dispose();
    delete downloadObj[key];
    delete playersRef[key];
  });
  console.log("playersObj", playersRef);
  console.log("downloadObj", downloadObj);
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (!downloadObj[url]) {
      // const dataArray = await getFromDB(url);
      // if (dataArray) {
      //   console.log("From Indexed DB", url);
      //   const bf = Tone.Buffer.fromArray(dataArray);
      //   downloadObj[url] = bf;
      // } else {
      console.log("Downloading", url);
      const buffer = await new Promise<ToneAudioBuffer>((res) => {
        const audioBuffer = new Tone.Buffer(url);
        audioBuffer.onload = (bf) => {
          // addToDB(url, bf.toArray() as Float32Array);
          res(bf);
        };
      });
      downloadObj[url] = buffer;
      // addToDB(url, buffer.toArray() as Float32Array);
      // }
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
  console.log("Tone.getContext().isOffline", Tone.getContext().isOffline);
  console.log("isToneInitialized", isToneInitialized);
  console.log("Tone.Transport.state", Tone.Transport.state);
  if (Tone.getContext().isOffline || !isToneInitialized) {
    isToneInitialized = true;
    await Tone.start();
    console.log("context started");
    setEvents();
    // if (!db) await initializeDB();
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
  if (introPlayerRef) {
    introPlayerRef?.stop();
    introPlayerRef?.dispose();
    introPlayerRef = null;
  }
  if (bpm) Tone.Transport.bpm.value = bpm;
  else Tone.Transport.bpm.dispose();
  await initializeTone();
  if (Tone.Transport.seconds) Tone.Transport.stop();
  if (instrPlayerRef) {
    instrPlayerRef.stop();
    instrPlayerRef.dispose();
    instrPlayerRef = null;
  }
  if (currentlyPlayingUrl && playersRef[currentlyPlayingUrl]) {
    playersRef[currentlyPlayingUrl].stop();
    playersRef[currentlyPlayingUrl].dispose();
    delete playersRef[currentlyPlayingUrl];
    delete downloadObj[currentlyPlayingUrl];
    currentlyPlayingUrl = "";
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
    if (url in playersRef) continue;
    playersRef[url] = new Tone.Player(downloadObj[url]).toDestination();
  }
  await Tone.loaded();
};

const switchVocals = async (id: string, vId: string, oldVId: string) => {
  if (oldVId === vId) return;
  // // Delete and dispose the old downloadobj
  // downloadObj[
  //   `https://voxaudio.nusic.fm/covers/${id}/${oldVId}.mp3`
  // ]?.dispose();
  // delete downloadObj[`https://voxaudio.nusic.fm/covers/${id}/${oldVId}.mp3`];
  const url = `https://voxaudio.nusic.fm/covers/${id}/${vId}.mp3`;
  if (currentlyPlayingUrl === url) return;
  // const dataArray = await getFromDB(url);
  let bf: ToneAudioBuffer;
  // if (dataArray) {
  //   console.log("From Indexed DB");
  //   bf = Tone.Buffer.fromArray(dataArray);
  // } else {
  console.log("Downloading", url);
  const buffer = await new Promise<ToneAudioBuffer>((res) => {
    const audioBuffer = new Tone.Buffer(url);
    audioBuffer.onload = (bf) => {
      // addToDB(url, bf.toArray() as Float32Array);
      res(bf);
    };
  });
  bf = buffer;
  // }
  playersRef[url] = new Tone.Player(bf).toDestination();

  if (currentlyPlayingUrl) {
    playersRef[currentlyPlayingUrl].stop();
    playersRef[currentlyPlayingUrl].dispose();
    delete playersRef[currentlyPlayingUrl];
    currentlyPlayingUrl = "";
  }
  playersRef[url].start(undefined, Tone.Transport.seconds);
  currentlyPlayingUrl = url;
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
  downloadObj[downloadObjKeys[0]]?.dispose();
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
  console.log("downloadObj", downloadObj);
};

const getToneStatus = () => {
  return {
    isTonePlaying,
    isMuted,
    toneLoadingForSection,
  };
};

const toggleMuteAudio = async () => {
  isMuted = !isMuted;
  if (introPlayerRef) {
    if (!isTonePlaying) {
      await initializeTone();
      introPlayerRef.start(0, 164.3);
      isTonePlaying = true;
    }
    introPlayerRef.mute = isMuted;
  }
  if (!isTonePlaying) return;
  playersRef[currentlyPlayingUrl] &&
    (playersRef[currentlyPlayingUrl].mute = isMuted);
  instrPlayerRef && (instrPlayerRef.mute = isMuted);
};

const downloadAndPlayIntro = async () => {
  // await initializeDB();
  const url = "https://voxaudio.nusic.fm/intro.mp3?alt=media";
  // const dataArray = await getFromDB(url);
  // let bf: ToneAudioBuffer;
  // if (dataArray) {
  //   console.log("From Indexed DB");
  //   bf = Tone.Buffer.fromArray(dataArray);
  // } else {
  console.log("Downloading", url);
  const buffer = await new Promise<ToneAudioBuffer>((res) => {
    const audioBuffer = new Tone.Buffer(url);
    audioBuffer.onload = (bf) => {
      // addToDB(url, bf.toArray() as Float32Array);
      res(bf);
    };
  });
  // bf = buffer;
  // }
  const introPlayer = new Tone.Player(buffer).toDestination();
  introPlayerRef = introPlayer;
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
  toggleMuteAudio,
  downloadAndPlayIntro,
  switchVocals,
};
