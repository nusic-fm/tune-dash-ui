import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";

import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import {
  downloadAndPlayIntro,
  downloadAudioFiles,
  getDurationOnScreen,
  marbleRacePlayVocals,
  prepareVocalPlayers,
  toggleMuteAudio,
} from "./hooks/useTonejs";
import { CoverV1, VoiceV1Cover } from "./services/db/coversV1.service";
import {
  createUserDoc,
  getUserDocById,
  rewardCoins,
  updateGameResult,
  UserDoc,
} from "./services/db/user.service";
import { getSkinPath, getTrailPath, getVoiceAvatarPath } from "./helpers";
import ScreenOne from "./components/ScreenOne";
import ScreenTwo from "./components/ScreenTwo";
import ChoosePrimaryVoice from "./components/ChoosePrimaryVoice";
import { useCollection } from "react-firebase-hooks/firestore";
import { query, collection, where, documentId } from "firebase/firestore";
import {
  db,
  logFirebaseEvent,
  setUserIdForAnalytics,
} from "./services/firebase.service";
import VoicesClash from "./components/VoicesClash";
import SmallImageMotionButton from "./components/Buttons/SmallImageMotionButton";
import SelectTrack from "./components/SelectTrack";
import SlideUp from "./components/SlideUp";
import WebApp from "@twa-dev/sdk";
import { EventBus } from "./game/EventBus";
import GameOverDialog from "./components/GameOverDialog";

export const tracks = ["01", "03", "06", "07", "16"];

const getGameBgPath = (screenName: string) => {
  switch (screenName) {
    case "splash":
    case "start":
      return "/assets/tunedash/bgs/start.webp";
    case "menu":
    case "select-track":
      return "/assets/tunedash/bgs/menu.webp";
    case "choose-primary-voice":
    case "voices-clash":
    case "game-ready":
      return "/assets/tunedash/bgs/voice.webp";
  }
};

// const screenNames = ["splash", "start", "menu", "select-track", "choose-primary-voice", "voices-clash", "game"];
export const COVER_IDS = [
  "HPF5qmOAAdfU4O9uJM5T",
  "7GskJxL0ldK9OGbl6e1Y",
  "jbX4FSCgZL3hz90CmnRd",
  "i9aUmvBYqdlCjqtQLe8u",
  "lsUBEcaYfOidpvjUxpz1",
];
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
  const [noOfRaceTracks, setNoOfRaceTracks] = useState(11);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
  const canvasElemWidth = isMobileView ? window.innerWidth : 414;
  // isMobileView
  //     ? window.innerWidth > 414
  //         ? 414
  //         : window.innerWidth
  //     : 414;
  const [primaryVoiceInfo, setPrimaryVoiceInfo] = useState<
    VoiceV1Cover[] | null
  >(null);
  const [secondaryVoiceInfo, setSecondaryVoiceInfo] = useState<
    VoiceV1Cover[] | null
  >(null);
  const [screenName, setScreenName] = useState("splash");
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [showOpponentVoiceSelection, setShowOpponentVoiceSelection] =
    useState(false);
  const [showGameOverButtons, setShowGameOverButtons] = useState<{
    xp: number;
    dash: number;
    show: boolean;
  }>({ xp: 0, dash: 0, show: false });
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [showIosNotice, setShowIosNotice] = useState(false);
  const [noOfVoices, setNoOfVoices] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [coversSnapshot, cssLoading, cssError] = useCollection(
    query(
      collection(db, "tunedash_covers"),
      where(documentId(), "in", COVER_IDS) // random
    )
  );
  const downloadVocalsAndStartGame = async () => {
    if (primaryVoiceInfo && secondaryVoiceInfo) {
      const urls = [
        `https://voxaudio.nusic.fm/covers/${selectedCoverDocId}/instrumental.mp3`,
        ...primaryVoiceInfo.map(
          (info) =>
            `https://voxaudio.nusic.fm/covers/${selectedCoverDocId}/${info.id}.mp3`
        ),
        ...secondaryVoiceInfo.map(
          (info) =>
            `https://voxaudio.nusic.fm/covers/${selectedCoverDocId}/${info.id}.mp3`
        ),
      ];
      await downloadAudioFiles(urls, (progress: number) => {
        // console.log("progress", progress);
        setDownloadProgress(progress);
      });
      await prepareVocalPlayers(urls);
    }
  };
  // Get UTM params from the url
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const utmTerm = urlParams.get("utm_term");
    const utmContent = urlParams.get("utm_content");
    console.log("utm params", {
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    });
    if (utmSource) {
      alert(utmSource);
    }
  }, []);

  useEffect(() => {
    const newNoOfVoices = (selectedLevel * 2) / 2;
    setNoOfVoices(newNoOfVoices);
    if (primaryVoiceInfo) {
      setPrimaryVoiceInfo(primaryVoiceInfo.slice(0, newNoOfVoices));
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (coversSnapshot?.docs.length) {
      (async () => {
        await downloadAndPlayIntro();
        if (WebApp.initDataUnsafe.user) {
          console.log(WebApp.initDataUnsafe.user);
          try {
            await createUserDoc(
              {
                firstName: WebApp.initDataUnsafe.user.first_name,
                lastName: WebApp.initDataUnsafe.user.last_name || "",
                username: WebApp.initDataUnsafe.user.username || "",
                id: WebApp.initDataUnsafe.user.id.toString(),
                photoUrl: WebApp.initDataUnsafe.user.photo_url || "",
                languageCode: WebApp.initDataUnsafe.user.language_code || "",
                isBot: WebApp.initDataUnsafe.user.is_bot || false,
                purchasedVoices: null,
                chatId: WebApp.initDataUnsafe.chat?.id || null,
                chatTitle: WebApp.initDataUnsafe.chat?.title || null,
                chatPhotoUrl: WebApp.initDataUnsafe.chat?.photo_url || null,
                xp: 0,
                level: 1,
                coins: 0,
              },
              WebApp.initDataUnsafe.user.id.toString(),
              (user) => {
                const newUser = { ...user };
                if (!newUser.xp) newUser.xp = 0;
                if (!newUser.coins) newUser.coins = 0;
                if (!newUser.level) newUser.level = 1;
                setUserDoc(newUser);
                setUserIdForAnalytics(user.id);
                setSelectedLevel(newUser.level);
              }
            );
          } catch (e) {
            // TODO: Handle error
          }
        }
        // else {
        //   const ud = await getUserDocById("839574155");
        //   setSelectedLevel(5);
        //   setUserDoc(ud);
        // }
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

  const onGameOver = async (
    isWinner: boolean,
    voices: VoiceV1Cover[],
    winningPositions: number[],
    xp: number,
    dash: number
  ) => {
    setIsPlayingGame(false);
    setShowGameOverButtons({
      xp,
      dash,
      show: true,
    });
    if (userDoc?.id) {
      // TODO
      logFirebaseEvent("race_result", {
        track_id: selectedCoverDocId,
        is_user_win: isWinner,
      });
      await updateGameResult(
        userDoc.id,
        selectedCoverDocId,
        isWinner,
        voices,
        winningPositions,
        xp,
        dash
      );
    }
  };

  useEffect(() => {
    EventBus.on("game-over", onGameOver);

    return () => {
      EventBus.removeListener("game-over", onGameOver);
    };
  }, [onGameOver]);

  return (
    <Stack id="app" gap={2} sx={{ width: "100%", height: "100vh" }}>
      {screenName === "splash" && (
        <SlideUp
          onSlideUp={async () => {
            if (WebApp.platform === "ios") {
              setShowIosNotice(true);
            }
            setScreenName("start");
            toggleMuteAudio();
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
              {screenName === "game" && isPlayingGame ? (
                <Stack
                  position={"absolute"}
                  top={0}
                  left={0}
                  right={0}
                  gap={1}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Box
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
                            primaryVoiceInfo[0].id
                          );
                        setSecondaryVoiceInfo(null);
                        setScreenName("voices-clash");
                      }}
                    />
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    position={"relative"}
                  >
                    <Stack width={160} gap={1} alignItems={"center"}>
                      <Typography
                        align="center"
                        sx={{
                          textTransform: "capitalize",
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#fff",
                          textShadow: "0px 0px 10px #f2ad31",
                        }}
                      >
                        Team {userDoc?.firstName || userDoc?.username}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        flexWrap={"wrap"}
                      >
                        {primaryVoiceInfo?.map((voice) => (
                          <img
                            key={voice.id}
                            src={getVoiceAvatarPath(voice.id)}
                            style={{
                              borderRadius: "50%",
                              outline: "4px solid #04344d",
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                        ))}
                      </Box>
                    </Stack>
                    <Box
                      position={"absolute"}
                      top={0}
                      left={0}
                      width={"100%"}
                      height={"100%"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <img
                        src="/assets/tunedash/vs.png"
                        width={60}
                        height={61}
                      />
                    </Box>
                    <Stack
                      width={160}
                      // height={160}
                      gap={1}
                      alignItems={"center"}
                    >
                      <Typography
                        align="center"
                        sx={{
                          textTransform: "capitalize",
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#fff",
                          textShadow: "0px 0px 10px #f2ad31",
                        }}
                      >
                        Captain GPT
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        flexWrap={"wrap"}
                      >
                        {secondaryVoiceInfo?.map((voice) => (
                          <img
                            key={voice.id}
                            src={getVoiceAvatarPath(voice.id)}
                            style={{
                              borderRadius: "50%",
                              outline: "8px solid #04344d",
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                        ))}
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              ) : showGameOverButtons.show ? (
                <GameOverDialog
                  xpEarnings={showGameOverButtons.xp}
                  dashEarnings={showGameOverButtons.dash}
                  onPlayAgain={() => {
                    logFirebaseEvent("race_again", {
                      track_id: selectedCoverDocId,
                      track_title: coverDoc?.title,
                      primary_voice_id: primaryVoiceInfo?.[0]?.id,
                    });
                    setScreenName("voices-clash");
                    setShowGameOverButtons({
                      xp: 0,
                      dash: 0,
                      show: false,
                    });
                    setSecondaryVoiceInfo(null);
                  }}
                  onNewRace={() => {
                    logFirebaseEvent("new_race", {
                      track_id: selectedCoverDocId,
                      track_title: coverDoc?.title,
                      primary_voice_id: primaryVoiceInfo?.[0]?.id,
                    });
                    setScreenName("select-track");
                    setShowGameOverButtons({
                      xp: 0,
                      dash: 0,
                      show: false,
                    });
                    primaryVoiceInfo?.length &&
                      setPrimaryVoiceInfo([primaryVoiceInfo[0]]);
                    setSecondaryVoiceInfo(null);
                  }}
                  onWatchRewardVideo={(newReward: number) => {
                    userDoc && rewardCoins(userDoc.id, "BONUS", newReward);
                  }}
                />
              ) : screenName === "game" ? (
                <></>
              ) : (
                <Header
                  showLevelsBar={screenName === "choose-primary-voice"}
                  selectedLevel={selectedLevel}
                  setSelectedLevel={setSelectedLevel}
                  showBackButton={screenName !== "start"}
                  showCoverTitle={
                    !!selectedCoverDocId && screenName !== "select-track"
                  }
                  onBackButtonClick={() => {
                    switch (screenName) {
                      case "menu":
                        setScreenName("start");
                        break;
                      case "select-track":
                        setScreenName("menu");
                        break;
                      case "choose-primary-voice":
                        setScreenName("select-track");
                        break;
                      case "voices-clash":
                      case "game-ready":
                        if (showOpponentVoiceSelection) {
                          setShowOpponentVoiceSelection(false);
                          setSecondaryVoiceInfo(null);
                        } else {
                          setScreenName("choose-primary-voice");
                        }
                        break;
                      case "game":
                        setScreenName("voices-clash");
                        break;
                      default:
                        setScreenName("start");
                    }
                  }}
                  coverTitle={coverDoc?.title || ""}
                  userDoc={userDoc}
                  onTaskButtonClick={(task: string) => {
                    if (task === "PLAY_DAILY_RACE") {
                      setScreenName("select-track");
                    }
                  }}
                />
              )}
              {screenName === "start" && (
                <ScreenOne
                  onStartClick={async () => {
                    setScreenName("menu");
                    logFirebaseEvent("start_from_landing_page", {
                      duration_on_screen: getDurationOnScreen(),
                    });
                    // const toneStatus = getToneStatus();
                    // if (toneStatus.isTonePlaying === false)
                    //   marbleRaceOnlyInstrument(selectedCoverDocId, 120, 0);
                  }}
                  showIosNotice={showIosNotice}
                />
              )}
              {screenName === "menu" && (
                <ScreenTwo
                  onSingleRaceClick={() => {
                    setScreenName("select-track");
                    logFirebaseEvent("menu_selection", {
                      selected_option: "single_race",
                    });
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
                    voiceInfo: VoiceV1Cover[] | null
                  ) => {
                    setCoverDoc(coverDoc);
                    setSelectedCoverDocId(coverId);
                    setPrimaryVoiceInfo(voiceInfo);
                    // TODO:
                    logFirebaseEvent("track_playback", {
                      track_id: coverId,
                      track_title: coverDoc?.title,
                      voice_id: voiceInfo?.[0]?.id,
                    });
                  }}
                  onNextPageClick={() => {
                    setScreenName("choose-primary-voice");
                    // TODO:
                    logFirebaseEvent("track_selection", {
                      track_id: selectedCoverDocId,
                      track_title: coverDoc?.title,
                      voice_id: primaryVoiceInfo?.[0]?.id,
                    });
                  }}
                />
              )}
              {coverDoc &&
                screenName === "choose-primary-voice" &&
                primaryVoiceInfo?.length && (
                  <ChoosePrimaryVoice
                    selectedCoverId={selectedCoverDocId}
                    voices={coverDoc.voices}
                    primaryVoiceInfo={primaryVoiceInfo}
                    onProceedToNextScreen={() => {
                      // setPrimaryVoiceInfo(voiceInfo);
                      // setScreenName("voices-clash");
                      setScreenName("game-ready");
                      // TODO:
                      logFirebaseEvent("voice_selection", {
                        track_id: selectedCoverDocId,
                        track_title: coverDoc?.title,
                      });
                    }}
                    setPrimaryVoiceInfo={setPrimaryVoiceInfo}
                    coverTitle={coverDoc.title}
                    userDoc={userDoc}
                    noOfVoices={noOfVoices}
                  />
                )}
              {primaryVoiceInfo?.length &&
                coverDoc &&
                (screenName === "voices-clash" ||
                  screenName === "game-ready") && (
                  <VoicesClash
                    voices={coverDoc.voices}
                    selectedCoverDocId={selectedCoverDocId}
                    primaryVoiceInfo={primaryVoiceInfo}
                    secondaryVoiceInfo={secondaryVoiceInfo}
                    onChooseOpponent={(voiceInfo) => {
                      setSecondaryVoiceInfo(voiceInfo);
                    }}
                    onStartRaceClick={async () => {
                      await downloadVocalsAndStartGame();
                      setIsPlayingGame(true);
                      setScreenName("game");
                    }}
                    downloadProgress={downloadProgress}
                    userDoc={userDoc}
                    showOpponentVoiceSelection={showOpponentVoiceSelection}
                    setShowOpponentVoiceSelection={
                      setShowOpponentVoiceSelection
                    }
                    noOfVoices={noOfVoices}
                  />
                )}
              {primaryVoiceInfo &&
                secondaryVoiceInfo &&
                screenName === "game" &&
                coverDoc && (
                  <PhaserGame
                    ref={phaserRef}
                    voices={[...primaryVoiceInfo, ...secondaryVoiceInfo].map(
                      (v) => ({
                        id: v.id,
                        name: v.name,
                        avatar: getVoiceAvatarPath(v.id),
                      })
                    )}
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
                    gravityY={4}
                    width={canvasElemWidth}
                    trailPath={getTrailPath(selectedTrailPath)}
                    dpr={window.devicePixelRatio || 2}
                    userMarbleIndexes={new Array(noOfVoices)
                      .fill(0)
                      .map((_, i) => i)}
                  />
                )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}

export default App;
