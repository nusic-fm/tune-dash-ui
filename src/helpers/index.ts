import { Timestamp } from "firebase/firestore";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import _ from "lodash";

export const getClosesNoInArr = (arr: number[], goal: number) =>
  arr.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  );
export const getYouTubeVideoId = (url: string) => {
  // YouTube video ID regex
  const regex = /[?&]v=([^#&]*)/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    // Handle cases where the URL format may differ
    console.error("Invalid YouTube URL");
    return null;
  }
};

export const getUserAvatar = (uid: string, avatarId: string) => {
  if (avatarId.length <= 2) {
    return `https://voxaudio.nusic.fm/avatars%2F${avatarId}.webp?alt=media`;
  }
  return `https://cdn.discordapp.com/avatars/${uid}/${avatarId}`;
};

export const nameToSlug = (name: string, delimiter = "-") => {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, delimiter) // Replace spaces with delimiter
    .replace(new RegExp(`${delimiter}+`, "g"), delimiter) // Replace consecutive delimiters
    .trim(); // Trim any leading/trailing whitespace
};

// Format a duration in seconds to a string in the format "mm:ss"
export const formatDuration = (value: number) => {
  const minute = Math.floor(value / 60);
  const secondLeft = value - minute * 60;
  return `${minute}:${
    secondLeft < 10 ? `0${secondLeft.toFixed(0)}` : secondLeft.toFixed(0)
  }`;
};

export const formatSecondsTohr = (seconds: number) => {
  // Calculate hours, minutes, and seconds
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Format the time string
  const formattedHours = hrs > 0 ? `${hrs.toString().padStart(2, "0")}h:` : "";
  const formattedMinutes = mins.toString().padStart(2, "0");
  const formattedSeconds = secs.toString().padStart(2, "0");

  return `${formattedHours}${formattedMinutes}m:${formattedSeconds}s`;
};

// const isLink = (text: string) => {
//     // Regular expression pattern to match URLs
//     var urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

//     return urlPattern.test(text);
// }

// Convert Firebase timestamp to a date string formatted to either "1h ago" or "May 21"
export const timestampToDateString = (timestamp?: Timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (hours < 24) {
    return `${Math.floor(hours)}h ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

export const sortArrBasedOnLikesObj = (
  voices: VoiceV1Cover[],
  likesObj?: { [key: string]: number; total: number }
) => {
  if (likesObj === undefined) return voices;

  return voices.sort((a, b) => {
    // compare the likes of the two voices and then return the voice with the most likes
    return (likesObj[b.id] || 0) - (likesObj[a.id] || 0);
  });
};

// export const timestampToDateString = (timestamp: Timestamp) => {
//   const date = timestamp.toDate();
//   const options = { weekday: "long", hour: "numeric", minute: "numeric" };
//   //No overload matches this call.
//   // return date.toLocaleDateString("en-US", options);
//   return date.toLocaleDateString("en-US", {
//     weekday: "long",
//     hour: "numeric",
//     minute: "numeric",
//   });
// };
export const createRandomNumber = (
  min: number,
  max: number,
  not?: number | number[]
) => {
  let random = Math.floor(Math.random() * (max - min + 1) + min);
  while (Array.isArray(not) ? not.includes(random) : random === not) {
    random = Math.floor(Math.random() * (max - min + 1) + min);
  }
  return random;
};

export const calculateXYPosition = (
  containerWidth: number,
  containerHeight: number,
  elementWidth: number,
  elementHeight: number
) => {
  // Initial position from left and top properties
  let x = 0.5 * containerWidth;
  let y = 0.9 * containerHeight;

  // Adjust for the translate(-50%, -50%) transform
  x -= 0.5 * elementWidth;
  y -= 0.5 * elementHeight;

  return { x, y };
};

export const calculatePositions = (
  containerWidth: number,
  containerHeight: number,
  innerContainerWidth: number,
  n: number
) => {
  // Element size
  const elementWidth = 60;
  const elementHeight = 60;

  // Reference point
  const refX = 0.5 * containerWidth;
  const refY = 0.9 * containerHeight;

  // Adjust for translation (-50%, -50%)
  const centerX = refX - 0.5 * elementWidth;
  const centerY = refY - 0.5 * elementHeight;

  // Calculate the number of rows and columns needed based on the inner container width
  const cols = Math.floor(innerContainerWidth / elementWidth);
  const rows = Math.ceil(n / cols);

  // Calculate the starting top-left position of the grid
  const startX = centerX - ((cols - 1) * elementWidth) / 2;
  const startY = centerY - ((rows - 1) * elementHeight) / 2;

  // if there is only one row, center the elements horizontally
  if (rows === 1) {
    const positions = [];
    for (let i = 0; i < n; i++) {
      const x = centerX + (i - (n - 1) / 2) * elementWidth;
      const y = centerY;
      positions.push({ x, y });
    }
    return positions;
  }

  // Initialize an array to store positions
  const positions = [];

  // Loop to calculate positions for each element in the grid
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = startX + col * elementWidth;
    const y = startY + row * elementHeight;
    positions.push({ x, y });
  }

  return positions;

  // // Calculate the starting left position of the row
  // const startX = centerX - ((n - 1) * elementWidth) / 2;

  // // Initialize an array to store positions
  // const positions = [];

  // // Loop to calculate positions for each element in the row
  // for (let i = 0; i < n; i++) {
  //   const x = startX + i * elementWidth;
  //   const y = centerY; // All elements in the same row
  //   positions.push({ x, y });
  // }

  // return positions;

  // // Calculate the number of rows and columns needed
  // const rows = Math.ceil(Math.sqrt(n));
  // const cols = rows;

  // // Calculate the starting top-left position of the grid
  // const startX = centerX - ((cols - 1) * elementWidth) / 2;
  // const startY = centerY - ((rows - 1) * elementHeight) / 2;

  // // Initialize an array to store positions
  // const positions = [];

  // // Loop to calculate positions for each element in the grid
  // for (let i = 0; i < n; i++) {
  //   const row = Math.floor(i / cols);
  //   const col = i % cols;
  //   const x = startX + col * elementWidth;
  //   const y = startY + row * elementHeight;
  //   positions.push({ x, y });
  // }

  // return positions;

  // // Positions for the 4 elements in a 2x2 grid
  // const positions = [
  //   { x: centerX - elementWidth * 2, y: centerY - elementHeight / 2 }, // Top-left
  //   { x: centerX - elementWidth * 1, y: centerY - elementHeight / 2 }, // Top-right
  //   { x: centerX + elementWidth * 1, y: centerY - elementHeight / 2 }, // Bottom-left
  //   { x: centerX + elementWidth * 2, y: centerY - elementHeight / 2 }, // Bottom-right
  // ];

  // return positions;
};

// Fill the array with its elements until it reaches the desired length
export const duplicateArrayElemToN = (
  arr: string[],
  n: number = 6
): string[] => {
  const result: string[] = [];
  const everySecondResultShouldBe = arr.filter((v) =>
    ["01", "03", "07"].includes(v)
  );
  for (let i = 0; i < n; i++) {
    const previous: string | undefined = result[i - 1];
    if (i % 2 === 0) {
      const availableTracks = everySecondResultShouldBe.filter(
        (track) => track !== previous
      );
      const selectedTrack = _.sample(availableTracks);
      selectedTrack && result.push(selectedTrack);
    } else {
      const selectedTrack = _.sample(arr.filter((v) => v !== previous));
      selectedTrack && result.push(selectedTrack);
    }
  }
  return result as string[];
};

// Beats array is the array of beats in the song
// groupLength is the number of beats in the group
// groupInterval is the interval between the start of each group
export const createBeatsGroupWithInterval = (
  beatsArray: number[],
  groupLength: number,
  noOfGroups: number,
  groupInterval: number
) => {
  // Create beats from random index for the number groupLength
  // Then Ignore the groupInterval no of beats
  // Then create a new group
  // Repeat the above step for the number of groups
  // Return the result
  const resultShowBeats = [];
  let beatIndex = createRandomNumber(8, 16);
  for (let i = 0; i < noOfGroups; i++) {
    for (let j = 0; j < groupLength; j++) {
      resultShowBeats.push(beatsArray[beatIndex]);
      beatIndex += createRandomNumber(1, 3);
    }
    beatIndex += groupInterval;
  }
  return resultShowBeats;
};

export const getBackgroundPath = (id: string) =>
  `https://voxaudio.nusic.fm/marble_race%2Fbackgrounds%2FBG${id}.png?alt=media`;
export const getTrailPath = (id: string) =>
  `https://voxaudio.nusic.fm/marble_race%2Ftrails%2F${id}?alt=media`;
export const getSkinPath = (id: string) =>
  `https://voxaudio.nusic.fm/${encodeURIComponent(
    "marble_race/track_skins/"
  )}${id}?alt=media`;
export const getTrackPath = (id: string) =>
  `https://voxaudio.nusic.fm/marble_race%2Foriginal_tracks%2F${id}.png?alt=media`;
export const getTrackPreviewPath = (id: string) =>
  `https://voxaudio.nusic.fm/marble_race%2Foriginal_tracks%2F${id}.png?alt=media`;
export const getVoiceAvatarPath = (voiceId: string) =>
  `https://voxaudio.nusic.fm/${encodeURIComponent(
    "voice_models/avatars/thumbs/"
  )}${voiceId}_200x200?alt=media`;

// const verifySignature = (data: any, key: string, expectedSignature: string) => {
//   const dataWithoutSign = { ...data };
//   delete dataWithoutSign.sign; // Remove existing signature for verification

//   const dataString = Object.entries(dataWithoutSign)
//     .sort()
//     .map(([k, v]) => `${k}=${v}`)
//     .join("&");
//   const actualSignature = crypto.HmacSHA512(dataString, key);

//   return actualSignature.toString() === expectedSignature;
// };
export const voiceList = [
  "alastor_hazbin-hotel",
  "alex-jones",
  "amy-winehouse",
  "ariana-grande",
  "arnold-schwarzenegger",
  "arthur-morgan_rdr2-",
  "bart-",
  "beavis",
  "bender",
  "biden",
  "billie-eilish",
  "britney-spears",
  "4-bruno-mars",
  "butthead",
  "cardi-b",
  "caseoh",
  "chester-bennington-",
  "cristiano-ronaldo",
  "daddy-pig",
  "daffy-duck",
  "darth-vader",
  "david-bowie",
  "deadpool",
  "dio",
  "donald-duck",
  "drake",
  "dua-lipa",
  "ed-sheeran",
  "edna-krabappel",
  "ellie_tlou",
  "elvis-presley",
  "eminemnew-era",
  "eric-cartman",
  "finneas",
  "franklin-clinton_gta-v",
  "fuwawa-abyssgard",
  "gawr-gura",
  "giancarlo-esposito_gustavo-fring",
  "goku",
  "gumball",
  "halle-bailey_ariel",
  "hatsune-miku",
  "hawk-tuah-girl",
  "homer",
  "homer",
  "hutao-jp",
  "imagine-dragons",
  "james-hetfield-",
  "jennie-blackpink",
  "john-marston_rdr2",
  "juice-wrld",
  "jungkook-bts",
  "justin-timberlake",
  "kanye-west",
  "katsuki-bakugou",
  "katsuki-bakugou",
  "kermit-the-frog",
  "king-charles",
  "kurt-cobain",
  "lady-gaga",
  "lana-del-rey",
  "lewis-capaldi",
  "lisa-blackpink",
  "lisa-simpson",
  "literally-a-violin",
  "lula-president-of-brazil",
  "mac-startup-sound-19982016",
  "marceline",
  "mariah-carey-daydream-era",
  "michael-jackson",
  "michael-rosen",
  "mickey-mouse",
  "miss-circle",
  "mordecai",
  "morgan-freeman",
  "mr-krabs",
  "ozzy-osburne",
  "pantera",
  "pantera",
  "pantera",
  "pantera",
  "pantera",
  "pantera",
  "pantera",
  "patrick-star",
  "peter-griffin",
  "plankton",
  "porcelain",
  "post-malone",
  "quagmire",
  "queen-elizabeth-ii",
  "richard-nixon",
  "rihanna",
  "roger-smith",
  "sabai-momoi",
  "samuel-l-jackson",
  "sandy-cheeks",
  "shakira",
  "shawn-mendes",
  "skibidi-toilet",
  "snoop-dogg",
  "solid-snake-mgs",
  "sonic",
  "spongebob",
  "squidward",
  "stephen-hawking",
  "taylor-swift",
  "tendou-arisu",
  "the-notorious-big",
  "the-weeknd",
  "the-weeknd",
  "tony-soprano",
  "toothbrush",
  "travis-scott_utopia",
  "trevor_gta-v",
  "trump",
  "trump",
  "vegeta",
  "villager",
  "villager",
  "whitney-houston",
  "wolverine",
  "yusuf-dikec",
  "zelda",
  "barack-obama",
  "billie-eilish-2019",
  "door",
  "enderman",
  "fuwamoco",
  "freddie-mercury",
  "lana-del-rey-20192021",
  "snoop-dogg-doggystyle-era",
  "slipknot",
  "steve-alpha-damage-sound",
  "tupac",
  "yoda",
  "zombie",
  "eminem",
  "putin",
  "hawk-tuah-girl",
];
export const tireList = [
  2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1,
  1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 1, 1,
  1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 3, 1, 3, 2, 1, 1, 1, 2, 2, 2, 1, 2, 1, 1,
  1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 2, 2, 1, 2, 1, 1, 3, 1, 2, 2, 2,
  2, 1, 1, 2, 1, 1, 1, 2, 3, 1, 2, 1, 1, 2, 3, 3, 1, 2, 2, 2, 1, 1, 3, 3, 2, 1,
  1, 1, 1, 3, 1, 2, 3, 1, 1, 1,
];

export const tireCost = [3, 2, 0.99];

export const hasTimestampCrossedOneDay = (timestamp: Timestamp | undefined) => {
  if (!timestamp) return true;
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return timestamp.toDate() < oneDayAgo;
};

const xpWinningsByLevels = [
  [1000, 50],
  [1000, 500, 50, 40],
  [1000, 500, 250, 50, 40, 30],
  [1000, 500, 250, 125, 50, 40, 30, 20],
  [1000, 500, 250, 125, 62, 50, 40, 30, 20, 10],
];
const dashWinningsByLevels = [
  [2000, 0],
  [2000, 1000, 0, 0],
  [4000, 2000, 1000, 0, 0, 0],
  [8000, 4000, 2000, 1000, 0, 0, 0, 0],
  [16000, 8000, 4000, 2000, 1000, 0, 0, 0, 0, 0],
];

export const getWinningRewardsByPosition = (
  position: number,
  level: number
) => {
  const xpWinnings = xpWinningsByLevels[level - 1];
  const dashWinnings = dashWinningsByLevels[level - 1];
  return {
    xp: xpWinnings[position - 1],
    dash: dashWinnings[position - 1],
  };
};

export const getTotalWinningRewards = (level: number, positions: number[]) => {
  let totalXp = 0;
  let totalDash = 0;
  for (const position of positions) {
    const rewards = getWinningRewardsByPosition(position, level);
    totalXp += rewards.xp;
    totalDash += rewards.dash;
  }
  return { totalXp, totalDash };
};

export const numberToK = (number: number) => {
  return number > 999 ? `${Math.floor(number / 1000)}K` : number;
};
export const numberToDecimalsK = (number: number) => {
  return number > 999 ? `${number / 1000}K` : number;
};
const XP_FOR_LEVELS = [0, 10000, 35000, 98000, 254000];
const DASH_FOR_LEVELS = [0, 25000, 125000, 625000, 3125000];

export const getLevelFromXp = (xp: number = 0) => {
  if (xp >= XP_FOR_LEVELS[4]) return 5;
  if (xp >= XP_FOR_LEVELS[3]) return 4;
  if (xp >= XP_FOR_LEVELS[2]) return 3;
  if (xp >= XP_FOR_LEVELS[1]) return 2;
  if (xp >= XP_FOR_LEVELS[0]) return 1;
  return 0;
};

export const getXpForNextLevel = (level: number) => {
  return XP_FOR_LEVELS[level];
};
export const getDashForNextLevel = (level: number) => {
  return DASH_FOR_LEVELS[level];
};

export const unlockAvailable = (
  xp: number,
  dash: number,
  currentLevel: number
) => {
  return (
    dash >= getDashForNextLevel(currentLevel) &&
    xp >= getXpForNextLevel(currentLevel)
  );
};

export type RewardType =
  | "DAILY_CHECK_IN"
  | "WATCH_AD"
  | "CONNECT_TON"
  | "PLAY_DAILY_RACE"
  | "PLAY_CHALLENGE"
  | "BONUS"
  | "REFERRAL"
  | "PURCHASE_DASH"
  | "JOIN_CHANNEL"
  | "SHARE_FRIENDS";

export const getRewardTokensAmount = (rewardType: RewardType) => {
  switch (rewardType) {
    case "WATCH_AD":
      return 1000;
    case "PLAY_DAILY_RACE":
      return 1500;
    case "JOIN_CHANNEL":
      return 1500;
    case "SHARE_FRIENDS":
      return 1000;
    default:
      return 0;
  }
};

export const noToPositionSuffix = (position: number) => {
  return position === 5
    ? "FIFTH PLACE"
    : position === 4
    ? "FOURTH PLACE"
    : position === 3
    ? "THIRD PLACE"
    : position === 2
    ? "SECOND PLACE"
    : "YOU WIN";
};

export const dashPerDollar = 400;
