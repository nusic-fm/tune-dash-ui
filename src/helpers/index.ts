import { Timestamp } from "firebase/firestore";
import { VoiceV1Cover } from "../services/db/coversV1.service";

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
    const formattedHours =
        hrs > 0 ? `${hrs.toString().padStart(2, "0")}h:` : "";
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
export const createRandomNumber = (min: number, max: number, not?: number) => {
    let random = Math.floor(Math.random() * (max - min + 1) + min);
    while (random === not) {
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
    const result = arr;
    while (result.length < n) {
        result.push(arr[createRandomNumber(0, arr.length - 1)]);
    }
    return result.sort(() => Math.random() - 0.5);
};

export const getBeatsArray = (id: string, startOffset: number): number[] => {
    let beatsArray: number[] = [];
    if (id === "lsUBEcaYfOidpvjUxpz1") {
        // welcome to the internet
        beatsArray = [
            0.84, 1.32, 1.82, 2.08, 2.32, 2.56, 2.78, 3.04, 3.26, 3.52, 3.74,
            3.98, 4.24, 4.48, 4.72, 4.96, 5.2, 5.44, 5.68, 5.92, 6.16, 6.4,
            6.64, 6.88, 7.12, 7.36, 7.6, 7.82, 8.06, 8.3, 8.54, 8.8, 9.02, 9.26,
            9.5, 9.74, 10.0, 10.24, 10.48, 10.72, 10.96, 11.2, 11.44, 11.68,
            11.92, 12.16, 12.4, 12.64, 12.88, 13.1, 13.36, 13.6, 13.82, 14.08,
            14.32, 14.56, 14.8, 15.06, 15.28, 15.54, 15.76, 16.24, 16.46, 16.7,
            16.96, 17.2, 17.44, 17.68, 17.92, 18.16, 18.4, 18.62, 18.88, 19.12,
            19.36, 19.6, 19.84, 20.08, 20.3, 20.54, 20.8, 21.02, 21.28, 21.52,
            21.76, 22.0, 22.24, 22.46, 22.7, 22.96, 23.18, 23.44, 23.68, 23.92,
            24.14, 24.38, 24.62, 24.86, 25.1, 25.34, 25.6, 25.84, 26.08, 26.32,
            26.56, 26.82, 27.04, 27.28, 27.52, 27.76, 28.0, 28.22, 28.46, 28.7,
            28.94, 29.2, 29.44, 29.68, 30.16, 30.64, 31.1, 31.58, 32.06, 32.54,
            33.04, 33.52, 33.98, 34.46, 34.94, 35.42, 35.9, 36.38, 36.86, 37.34,
            37.82, 38.3, 38.78, 39.28, 39.76, 40.24, 40.72, 41.2, 41.68, 42.16,
            42.64, 43.12, 43.58, 44.06, 44.56, 45.04, 45.52, 46.0, 46.48, 46.94,
            47.42, 47.9, 48.38, 48.86, 49.34, 49.8, 50.28, 50.76, 51.22, 51.68,
            52.14, 52.62, 53.08, 53.54, 54.02, 54.48, 54.92, 55.38, 55.84, 56.3,
            56.74, 57.2, 57.64, 58.1, 58.56, 59.0, 59.48, 59.82, 60.14, 60.52,
            61.24, 61.36, 61.62, 62.04, 62.88, 63.72, 64.14, 64.54, 64.98,
            65.38, 65.8, 66.2, 66.62, 67.04, 67.42, 67.84, 68.24, 68.64, 69.04,
            69.44, 69.82, 70.22, 70.6, 70.98, 71.38, 71.76, 72.14, 72.5, 72.9,
            73.26, 73.64, 74.0, 74.38, 74.74, 75.1, 75.46, 75.84, 76.2, 76.56,
            76.92, 77.28, 77.66, 78.02, 78.38, 78.74, 79.1, 79.46, 79.84, 80.2,
            80.56, 80.92, 81.28, 82.02, 82.38, 82.74, 83.1, 83.46, 83.82, 84.18,
            84.56, 84.92, 85.28, 85.64, 86.0, 86.38, 86.74, 87.1, 87.48, 87.84,
            88.2, 88.56, 88.94, 89.28, 90.0, 90.74, 91.46, 91.82, 92.18, 92.54,
            92.92, 93.28, 93.64, 94.0, 94.36, 94.74, 95.1, 95.46, 95.82, 96.2,
            96.56, 96.92, 97.28, 97.64, 98.02, 98.38, 98.74, 99.1, 99.44,
            100.18, 100.54, 100.92, 101.28, 101.66, 102.02, 102.38, 103.1,
            103.82, 104.2, 104.56, 105.3, 106.02, 106.76, 107.48, 108.2, 108.92,
            109.64, 110.0, 110.38, 110.74, 111.1, 111.46, 111.82, 112.18,
            112.56, 112.92, 113.28, 114.02, 114.74, 115.46, 115.82, 116.2,
            116.56, 116.92, 117.64, 118.38, 118.74, 119.1, 119.3, 119.42,
            119.96, 120.56, 121.14, 121.84, 122.48, 123.12, 123.76, 124.42,
            125.06, 125.7, 126.32, 126.96, 127.6, 128.22, 128.86, 129.5, 130.1,
            130.74, 131.36, 132.0, 132.64, 133.26, 133.9, 134.52, 135.14,
            135.78, 136.4, 137.04, 137.68, 138.3, 138.94, 139.58, 140.2, 140.84,
            141.46, 142.1, 142.76, 143.38, 144.0, 144.64, 145.28, 145.9, 146.54,
            147.16, 147.8, 148.42, 149.06, 149.72, 150.34, 150.96, 151.6,
            152.22, 152.82, 153.46, 154.1, 154.72, 155.36, 156.0, 156.62,
            157.26, 157.9, 158.5, 159.14, 159.78, 160.42, 161.02, 161.66, 162.3,
            162.96, 163.6, 164.24, 164.86, 165.46, 166.1, 166.72, 167.38,
            167.98, 168.62, 169.28, 169.9, 170.52, 171.14, 171.78, 172.42,
            173.04, 173.68, 174.3, 174.94, 175.56, 176.18, 176.8, 177.44,
            178.08, 178.72, 179.36, 180.0, 180.62, 181.24, 181.88, 182.54,
            183.16, 183.8, 184.44, 185.08, 185.7, 186.32, 186.92, 187.58, 188.2,
            188.82, 189.48, 190.12, 190.72, 191.34, 191.98, 192.62, 193.24,
            193.88, 194.52, 195.16, 195.82, 196.42, 197.04, 197.66, 198.3,
            198.96, 199.6, 200.22, 200.84, 201.48, 202.12, 202.74, 203.38,
            204.02, 204.64, 205.28, 205.9, 206.52, 207.14, 207.76, 208.4,
            209.06, 209.24, 209.7, 210.3, 210.94, 211.56, 212.18, 212.86, 213.5,
            214.12, 214.74, 215.38, 216.04, 216.7, 217.28, 217.94, 218.56,
            219.18, 219.82, 220.44, 221.08, 221.72, 222.36, 222.96, 223.6,
            224.26, 224.86, 225.46, 226.1, 226.74, 227.2, 227.4, 228.06, 228.68,
            229.3, 229.92, 230.56, 232.4, 233.04, 233.68, 234.32, 234.98, 235.6,
            236.22, 236.84, 237.48, 238.12, 238.74, 239.38, 240.0, 240.62,
            241.26, 241.86, 242.5, 243.14, 243.78, 244.42, 245.06, 245.7,
            246.34, 246.94, 247.58, 248.2, 248.84, 249.46, 250.1, 250.74,
            251.38, 252.0, 252.64, 253.26, 253.9, 254.54, 255.16, 255.78,
            256.42, 257.04, 257.68, 258.3, 258.94, 259.58, 260.22, 260.9, 261.6,
            262.18, 262.3, 262.88, 263.56, 264.12, 265.16, 265.5, 265.86,
            266.56, 267.16, 267.26, 267.8, 267.98, 268.68, 269.38, 270.1, 270.8,
            271.5, 272.2, 272.92, 273.62, 274.3,
        ];
    } else if (id === "YE7LMzWbCKgkLgSKVX9Q") {
        // mordecai
        beatsArray = [
            0.32, 1.04, 1.76, 2.48, 3.2, 3.94, 4.66, 5.38, 6.1, 6.82, 7.56,
            8.28, 8.98, 9.72, 10.44, 11.16, 11.88, 12.62, 13.34, 14.06, 14.76,
            15.5, 16.22, 16.96, 17.66, 18.4, 19.12, 19.86, 20.54, 21.28, 22.0,
            22.74, 23.44, 24.16, 24.9, 25.64, 26.34, 27.06, 27.8, 28.52, 29.24,
            29.92, 30.68, 31.4, 32.12, 32.84, 33.58, 34.3, 35.02, 35.74, 36.46,
            37.2, 37.92, 38.64, 39.36, 40.08, 40.8, 41.54, 42.24, 42.98, 43.7,
            44.42, 45.14, 45.86, 46.58, 47.32, 48.04, 48.76, 49.48, 50.2, 50.92,
            51.66, 52.38, 53.1, 53.82, 54.54, 55.26, 55.98, 56.68, 57.42, 58.16,
            58.88, 59.6, 60.32, 61.04, 61.76, 62.48, 63.22, 63.94, 64.66, 65.38,
            66.12, 66.84, 67.56, 68.28, 69.0, 69.72, 70.44, 71.16, 71.88, 72.62,
            73.34, 74.06, 74.78, 75.5, 76.22, 76.96, 77.68, 78.4, 79.1, 79.84,
            80.58, 81.28, 82.02, 82.72, 83.46, 84.18, 84.9, 85.62, 86.36, 87.08,
            87.8, 88.52, 89.24, 89.96, 90.68, 91.4, 92.12, 92.84, 93.58, 94.3,
            95.02, 95.74, 96.48, 97.2, 97.9, 98.64, 99.36, 100.08, 100.8,
            101.52, 102.26, 102.96, 103.7, 104.42, 105.14, 105.86, 106.58,
            107.3, 108.02, 108.74, 109.48, 110.2, 110.92, 111.64, 112.36,
            113.08, 113.8, 114.54, 115.26, 115.98, 116.7, 117.42, 118.16,
            118.88, 119.62, 120.32, 121.04, 121.76, 122.48, 123.22, 123.94,
            124.66, 125.38, 126.1, 126.82, 127.54, 128.28, 129.0, 129.72,
            130.44, 131.16, 131.9, 132.62, 133.32, 134.06, 134.78, 135.5,
            136.22, 136.94, 137.68, 138.38, 139.12, 139.86, 140.58, 141.3,
            142.02, 142.74, 143.46, 144.2, 144.94, 145.66, 146.36, 147.1,
            147.82, 148.54, 149.26, 149.96, 150.68, 151.4, 152.14, 152.86,
            153.58, 154.3, 155.02, 155.74, 156.48, 157.2, 157.9, 158.64, 159.36,
            160.08, 160.78, 161.52, 162.24, 162.98, 163.7, 164.42, 165.14,
            165.86, 166.56, 167.3, 168.02, 168.76, 169.48, 170.2, 170.92,
            171.64, 172.36, 173.1, 173.82, 174.52, 175.26, 175.98, 176.7,
            177.44, 178.16, 178.88, 179.58, 180.32, 181.04, 181.76, 182.48,
            183.2, 183.92, 184.66, 185.36,
        ];
    }
    return beatsArray.filter((beat) => beat > startOffset);
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