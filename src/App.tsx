import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";

import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import {
  downloadAndPlayIntro,
  downloadAudioFiles,
  marbleRacePlayVocals,
  prepareVocalPlayers,
  toggleMuteAudio,
} from "./hooks/useTonejs";
import { CoverV1, VoiceV1Cover } from "./services/db/coversV1.service";
import { createUserDoc } from "./services/db/user.service";
import { getSkinPath, getTrailPath, getVoiceAvatarPath } from "./helpers";
import ScreenOne from "./components/ScreenOne";
import ScreenTwo from "./components/ScreenTwo";
import ChoosePrimaryVoice from "./components/ChoosePrimaryVoice";
import { useCollection } from "react-firebase-hooks/firestore";
import { query, collection, where, documentId } from "firebase/firestore";
import { db } from "./services/firebase.service";
import VoicesClash from "./components/VoicesClash";
import SmallImageMotionButton from "./components/Buttons/SmallImageMotionButton";
import SelectTrack from "./components/SelectTrack";
import SlideUp from "./components/SlideUp";
import WebApp from "@twa-dev/sdk";

export const tracks = [
  "01",
  // "02",
  "03",
  "06",
  "07",
  // "11",
  // "14",
  "16",
  // "21",
  // "22",
];

// const gameBgPaths = [
//   "/assets/tunedash/bgs/home.png",
//   "/assets/tunedash/bgs/home-menu.png",
//   "/assets/tunedash/bgs/home-menu.png",
//   "/assets/tunedash/bgs/home-voice.png",
// ];
const getGameBgPath = (screenName: string) => {
  switch (screenName) {
    case "splash":
    case "start":
      return "/assets/tunedash/bgs/start.png";
    case "menu":
      return "/assets/tunedash/bgs/menu.png";
    case "select-track":
      return "/assets/tunedash/bgs/menu.png";
    case "choose-primary-voice":
      return "/assets/tunedash/bgs/voice.png";
    case "voices-clash":
      return "/assets/tunedash/bgs/voice.png";
    case "game-ready":
      return "/assets/tunedash/bgs/voice.png"; //TODO
  }
};

// const screenNames = ["splash", "start", "menu", "select-track", "choose-primary-voice", "voices-clash", "game"];

function App() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [coverDoc, setCoverDoc] = useState<CoverV1 | null>(null);
  const [selectedCoverDocId, setSelectedCoverDocId] = useState<string>("");
  const [selectedSkinPath, setSelectedSkinPath] = useState<string>(
    "sutureGradient01.png"
  );
  const [selectedTrailPath, setSelectedTrailPath] =
    useState<string>("chrome_ball.png");
  const [selectedTracksList, setSelectedTracksList] = useState<string[]>(() => {
    // Check in the localstorage if there are selected tracks
    // const localTracks = localStorage.getItem("selectedTracks");
    // if (localTracks) {
    //   const arr = JSON.parse(localTracks);
    //   // unique array
    //   return [...new Set(arr)].filter((t) =>
    //     tracks.includes(t as string)
    //   ) as string[];
    // }
    return tracks;
  });
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [startSectionIdx, setStartSectionIdx] = useState(1);
  const [noOfRaceTracks, setNoOfRaceTracks] = useState(10);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
  const canvasElemWidth = isMobileView ? window.innerWidth : 414;
  // isMobileView
  //     ? window.innerWidth > 414
  //         ? 414
  //         : window.innerWidth
  //     : 414;
  const [primaryVoiceInfo, setPrimaryVoiceInfo] = useState<VoiceV1Cover | null>(
    null
  );
  const [secondaryVoiceInfo, setSecondaryVoiceInfo] =
    useState<VoiceV1Cover | null>(null);
  const [screenName, setScreenName] = useState("splash");
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [userInfo, setUserInfo] = useState<{ id: string; fn: string } | null>(
    null
  );
  const [coversSnapshot, cssLoading, cssError] = useCollection(
    query(
      collection(db, "covers"),
      where(documentId(), "in", [
        // "PkOBGtGbdyMSEkG0BQ6O",
        //   "f0pmE4twBXnJmVrJzh18",
        //   // "ByE2N5MsLcSYpUR8s6a3",
        //   "YE7LMzWbCKgkLgSKVX9Q",
        //   "bkvtnO1D4fOUYvzwn0NJ",
        //   // "abRoiarmwTRMqWTyqSGn",
        "Sey1qVFqitYhnKkddMuQ",
        "RL2bdU5NJOukDwQzzW1s",
        "NAc4aENdcDHIh2k4K5oG",
        "8FbtvPhkC13vo3HnAirx",
        "lsUBEcaYfOidpvjUxpz1",
        //   "hoZTAYrVO5qYmHz9CZtV",
      ]) // random
    )
  );
  const downloadVocalsAndStartGame = async () => {
    if (primaryVoiceInfo && secondaryVoiceInfo) {
      const urls = [
        `https://voxaudio.nusic.fm/covers/${selectedCoverDocId}/instrumental.mp3`,
        `https://voxaudio.nusic.fm/covers/${selectedCoverDocId}/${primaryVoiceInfo.id}.mp3`,
        `https://voxaudio.nusic.fm/covers/${selectedCoverDocId}/${secondaryVoiceInfo?.id}.mp3`,
      ];
      await downloadAudioFiles(urls, (progress: number) => {
        console.log("progress", progress);
        setDownloadProgress(progress);
      });
      await prepareVocalPlayers(urls);
    }
  };

  useEffect(() => {
    if (coversSnapshot?.docs.length) {
      (async () => {
        await downloadAndPlayIntro();
        setIsDownloaded(true);
        // setScreenName("start");
      })();
      // const _coverDoc = coversSnapshot?.docs[0].data() as CoverV1;
      // const _coverId = coversSnapshot?.docs[0].id;
      // setCoverDoc(_coverDoc);
      // setSelectedCoverDocId(_coverId);
      // (async () => {
      //   // await downloadInstrumental(_coverId, _coverDoc);
      //   setScreenIdx(0);
      // })();
    }
  }, [coversSnapshot]);

  // if (screenName === "splash") {
  //   return (
  //     <Stack id="app" gap={2} sx={{ width: "100%", height: "100vh" }}>
  //       <Box width={"100%"} display="flex" justifyContent={"center"}>
  //         <Box
  //           display={"flex"}
  //           justifyContent="center"
  //           alignItems={"center"}
  //           width={canvasElemWidth}
  //         >
  //           <Box
  //             width={canvasElemWidth}
  //             height={"100vh"}
  //             sx={{
  //               background: `url(/assets/tunedash/bgs/splash.png)`,
  //               backgroundPosition: "center",
  //               backgroundSize: "cover",
  //               // borderRadius: 8,
  //             }}
  //             display="flex"
  //             alignItems={"start"}
  //             justifyContent={"center"}
  //           >
  //             <Typography>Loading...</Typography>
  //           </Box>
  //         </Box>
  //       </Box>
  //     </Stack>
  //   );
  // }

  return (
    <Stack id="app" gap={2} sx={{ width: "100%", height: "100vh" }}>
      {screenName === "splash" && (
        <SlideUp
          onSlideUp={() => {
            toggleMuteAudio();
            setScreenName("start");
          }}
          enableSlideUp={isDownloaded}
        />
      )}
      <Box width={"100%"} display="flex" justifyContent={"center"}>
        <Box
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          width={canvasElemWidth}
        >
          <Box
            width={canvasElemWidth}
            height={"100vh"}
            sx={{
              background: `url(${getGameBgPath(screenName)})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              // borderRadius: 8,
            }}
            display="flex"
            alignItems={"start"}
            justifyContent={"center"}
          >
            <Stack
              // px={2}
              gap={4}
              // sx={{
              //     background: "rgba(0,0,0,0.6)",
              // }}
              height={"100%"}
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              position={"relative"}
            >
              {screenName === "game" ? (
                <Box
                  position={"absolute"}
                  top={0}
                  left={0}
                  right={0}
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  pt={1}
                >
                  <SmallImageMotionButton
                    name="Stop"
                    onClick={() => {
                      phaserRef.current?.game?.destroy(true);
                      phaserRef.current = null;
                      !!primaryVoiceInfo &&
                        marbleRacePlayVocals(
                          selectedCoverDocId,
                          primaryVoiceInfo.id
                        );
                      setSecondaryVoiceInfo(null);
                      setScreenName("voices-clash");
                    }}
                  />
                </Box>
              ) : (
                <Header
                  showBackButton={screenName !== "start"}
                  showCoverTitle={!!selectedCoverDocId}
                  onBackButtonClick={() => {
                    setScreenName(
                      screenName === "menu"
                        ? "start"
                        : screenName === "select-track"
                        ? "menu"
                        : screenName === "choose-primary-voice"
                        ? "select-track"
                        : screenName === "voices-clash" ||
                          screenName === "game-ready"
                        ? "choose-primary-voice"
                        : "start"
                    );
                  }}
                  coverTitle={coverDoc?.title || ""}
                />
              )}
              {screenName === "start" && (
                <ScreenOne
                  onStartClick={async () => {
                    if (WebApp.initDataUnsafe.user) {
                      window.open(
                        "https://sbx-crypto-payment.alchemypay.org/?orderNum=300217314207413593603",
                        "_blank"
                      );
                      // alert(
                      //   JSON.stringify({
                      //     fn: WebApp.initDataUnsafe.user.first_name,
                      //     ln: WebApp.initDataUnsafe.user.last_name,
                      //     id: WebApp.initDataUnsafe.user.id,
                      //     photo_url: WebApp.initDataUnsafe.user.photo_url,
                      //     username: WebApp.initDataUnsafe.user.username,
                      //     auth_date: WebApp.initDataUnsafe.auth_date,
                      //     lang: WebApp.initDataUnsafe.user.language_code,
                      //   })
                      // );
                      try {
                        setUserInfo({
                          id: WebApp.initDataUnsafe.user.id.toString(),
                          fn: WebApp.initDataUnsafe.user.first_name,
                        });
                        createUserDoc(
                          {
                            firstName: WebApp.initDataUnsafe.user.first_name,
                            lastName:
                              WebApp.initDataUnsafe.user.last_name || "",
                            username: WebApp.initDataUnsafe.user.username || "",
                            id: WebApp.initDataUnsafe.user.id.toString(),
                            photoUrl:
                              WebApp.initDataUnsafe.user.photo_url || "",
                            languageCode:
                              WebApp.initDataUnsafe.user.language_code || "",
                            isBot: WebApp.initDataUnsafe.user.is_bot || false,
                          },
                          WebApp.initDataUnsafe.user.id.toString()
                        );
                      } catch (e) {
                        // TODO: Handle error
                      }
                    }

                    setScreenName("menu");
                    // const toneStatus = getToneStatus();
                    // if (toneStatus.isTonePlaying === false)
                    //   marbleRaceOnlyInstrument(selectedCoverDocId, 120, 0);
                  }}
                />
              )}
              {screenName === "menu" && (
                <ScreenTwo
                  onSingleRaceClick={() => {
                    setScreenName("select-track");
                  }}
                />
              )}
              {coversSnapshot && screenName === "select-track" && (
                <SelectTrack
                  coversSnapshot={coversSnapshot}
                  selectedCoverDocId={selectedCoverDocId}
                  onTrackSelected={(
                    coverDoc: CoverV1,
                    coverId: string,
                    voiceInfo: VoiceV1Cover | null
                  ) => {
                    setCoverDoc(coverDoc);
                    setSelectedCoverDocId(coverId);
                    setPrimaryVoiceInfo(voiceInfo);
                    setScreenName("choose-primary-voice");
                  }}
                />
              )}
              {coverDoc && screenName === "choose-primary-voice" && (
                <ChoosePrimaryVoice
                  selectedCoverId={selectedCoverDocId}
                  voices={coverDoc.voices}
                  primaryVoiceInfo={primaryVoiceInfo}
                  onPrimaryVoiceSelected={(voiceInfo) => {
                    setPrimaryVoiceInfo(voiceInfo);
                    // setScreenName("voices-clash");
                    setScreenName("game-ready");
                  }}
                />
              )}
              {primaryVoiceInfo &&
                coverDoc &&
                (screenName === "voices-clash" ||
                  screenName === "game-ready") && (
                  <VoicesClash
                    voices={coverDoc.voices}
                    primaryVoiceId={primaryVoiceInfo.id}
                    secondaryVoiceId={secondaryVoiceInfo?.id || ""}
                    onChooseOpponent={(voiceInfo) => {
                      setSecondaryVoiceInfo(voiceInfo);
                    }}
                    onStartRaceClick={async () => {
                      await downloadVocalsAndStartGame();
                      setScreenName("game");
                    }}
                    downloadProgress={downloadProgress}
                    userInfo={userInfo}
                  />
                )}
              {primaryVoiceInfo &&
                secondaryVoiceInfo &&
                screenName === "game" &&
                coverDoc && (
                  <PhaserGame
                    ref={phaserRef}
                    voices={[primaryVoiceInfo, secondaryVoiceInfo].map((v) => ({
                      id: v.id,
                      name: v.name,
                      avatar: getVoiceAvatarPath(v.id),
                    }))}
                    coverDocId={selectedCoverDocId}
                    musicStartOffset={
                      coverDoc?.sections?.at(startSectionIdx - 1)?.start || 0
                    }
                    skinPath={getSkinPath(selectedSkinPath)}
                    backgroundPath={`https://voxaudio.nusic.fm/marble_race%2Frace_bgs%2Fsunset.png?alt=media`}
                    selectedTracks={[...selectedTracksList].slice(
                      0,
                      noOfRaceTracks
                    )}
                    noOfRaceTracks={noOfRaceTracks}
                    gravityY={9}
                    width={canvasElemWidth}
                    trailPath={getTrailPath(selectedTrailPath)}
                  />
                )}
              {/* {coverDoc && isDownloading ? (
                  <LinearProgressWithLabel
                    value={downloadProgress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                ) : !showGameMenu ? (
                ) : (
                  <Box width={140} height={65} mt={12}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: "url(/assets/tunedash/start.png)",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowGameMenu(true);
                      }}
                    />
                  </Box>
                  // <Button
                  //     onClick={() => {
                  //         downloadAndPlay();
                  //     }}
                  //     variant="contained"
                  //     color="primary"
                  // >
                  //     Play
                  // </Button>
                )} */}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}

export default App;
