import { Stack, Box, Typography, CircularProgress } from "@mui/material";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import {
  createRandomNumber,
  dashPerDollar,
  getVoiceAvatarPath,
  tireCost,
  tireList,
  voiceList,
} from "../helpers";
import { useEffect, useState } from "react";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import { updateUserProps, UserDoc } from "../services/db/user.service";
import DisplayMultiVoiceSelection, {
  FOCUS_COLORS,
} from "./DisplayMultiVoiceSelection";
import { FIVE_LIGHT_COLORS } from "./ChoosePrimaryVoice";
import { increment } from "firebase/firestore";
import WebApp from "@twa-dev/sdk";

type Props = {
  onProceedToNextScreen: () => void;
  voices: VoiceV1Cover[];
  userDoc: UserDoc;
  noOfVoices: number;
  setSecondaryVoiceInfo: React.Dispatch<
    React.SetStateAction<VoiceV1Cover[] | null>
  >;
};

const ChooseOpponentVoice = ({
  onProceedToNextScreen,
  voices,
  userDoc,
  noOfVoices,
  setSecondaryVoiceInfo,
}: Props) => {
  const [voicesInfo, setVoicesInfo] = useState<VoiceV1Cover[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDash, setTotalDash] = useState(0);

  useEffect(() => {
    if (noOfVoices === 1) {
      setCurrentIdx(0);
    } else {
      const findNextEmptyIdx = (idx: number) => {
        if (voicesInfo[idx]) {
          if (idx === noOfVoices - 1) {
            return idx;
          }
          return findNextEmptyIdx(idx + 1);
        }
        return idx;
      };
      setCurrentIdx(findNextEmptyIdx(0));
    }
  }, [noOfVoices]);

  return (
    <Stack
      gap={2}
      height={"100%"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
    >
      <Typography
        variant="h6"
        sx={{
          textTransform: "capitalize",
          color: "#fff",
          textShadow: "0px 0px 10px #f2ad31",
        }}
      >
        Team Captain GPT
      </Typography>
      <DisplayMultiVoiceSelection
        noOfVoices={noOfVoices}
        voicesInfo={voicesInfo}
        currentIdx={currentIdx}
      />
      <Box
        width={window.innerWidth > 350 ? 350 : window.innerWidth}
        height={window.innerWidth > 350 ? 430 : 385}
        sx={{
          background: "url(/assets/tunedash/menu-voice-rect.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        position={"relative"}
        mb={2}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexWrap={"wrap"}
          height={"85%"}
          width={"100%"}
          // my={2}
          borderRadius={10}
          sx={{
            overflowY: "auto",
          }}
          gap={2}
        >
          {voices.map((voice, idx) => {
            const voiceIdx = voiceList.indexOf(voice.id);
            const tireIdx = tireList[voiceIdx];
            const cost = tireCost[tireIdx - 1];

            return (
              <Stack
                key={idx}
                width={"25%"}
                alignItems={"center"}
                position={"relative"}
              >
                <Box
                  position={"absolute"}
                  top={0}
                  right={5}
                  bgcolor={"#f2ad31"}
                  borderRadius={1}
                  px={0.3}
                  // py={0.5}
                  zIndex={11}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography variant="caption" color={"#000"} fontSize={8}>
                    {cost * dashPerDollar}
                  </Typography>
                </Box>
                <Box
                  onClick={async () => {
                    if (voicesInfo.map((v) => v.id).includes(voice.id)) {
                      return;
                    }
                    const dash = cost * dashPerDollar;
                    const _totalDash = totalDash + dash;
                    if (_totalDash > userDoc?.coins) {
                      return WebApp.showAlert("You don't have enough coins");
                    }
                    setCurrentIdx((prevIdx) => (prevIdx + 1) % noOfVoices);
                    const newVoices = [...voicesInfo];
                    newVoices[currentIdx] = voice;
                    setVoicesInfo(newVoices);
                    setTotalDash(totalDash + dash);
                    // setSelectedVoiceInfo(voice);
                    setIsLoading(true);
                    // await switchVocalsByDownloading(
                    //   selectedCoverId,
                    //   voice.id,
                    //   selectedVoiceInfo.id
                    // );
                    setIsLoading(false);
                  }}
                  position={"relative"}
                  width={65}
                  height={65}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRadius={"50%"}
                  border={"4px solid #AABBCC"}
                >
                  {voicesInfo.map((v) => v.id).includes(voice.id) && (
                    <Box
                      position={"absolute"}
                      top={0}
                      left={0}
                      zIndex={10}
                      width={"100%"}
                      height={"100%"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      borderRadius={"50%"}
                      sx={{ background: "rgba(0, 0, 0, 0.5)" }}
                    >
                      {isLoading ? (
                        <CircularProgress
                          sx={{ color: FIVE_LIGHT_COLORS[currentIdx - 1] }}
                          size={20}
                        />
                      ) : (
                        // <DoneRoundedIcon
                        //   sx={{ color: FIVE_LIGHT_COLORS[currentIdx - 1] }}
                        //   fontSize="large"
                        // />
                        <Box
                          sx={{
                            width: 22,
                            height: 18,
                            background:
                              FIVE_LIGHT_COLORS[
                                voicesInfo.findIndex((v) => v.id === voice.id)
                              ],
                            borderRadius: 1,
                          }}
                          width={"100%"}
                          height={"100%"}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color={"#000"}
                            fontSize={12}
                          >
                            {voicesInfo.findIndex((v) => v.id === voice.id) + 1}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                  {voicesInfo.map((v) => v.id).includes(voice.id) && (
                    <img
                      src={`/assets/tunedash/focus_${
                        FOCUS_COLORS[
                          voicesInfo.findIndex((v) => v.id === voice.id)
                        ]
                      }.png`}
                      width={"100%"}
                      height={"100%"}
                      style={{
                        zIndex: 0,
                        cursor: "pointer",
                        // zoom: 1.1,
                        transform: "scale(1.2)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    />
                  )}
                  <img
                    src={getVoiceAvatarPath(voice.id)}
                    width={60}
                    height={60}
                    style={{
                      borderRadius: "50%",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  />
                </Box>
                <Typography
                  color={"#f0f0f0"}
                  fontSize={12}
                  fontWeight={900}
                  textAlign={"center"}
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {voice.name}
                </Typography>
              </Stack>
            );
          })}
        </Box>
      </Box>
      <Box pt={2} position={"sticky"} bottom={0} zIndex={10}>
        <LongImageMotionButton
          onClick={async () => {
            const newvoicesInfo = [...voicesInfo];
            if (newvoicesInfo.length < noOfVoices) {
              // Generate random voices
              const neededNoOfVoices = noOfVoices - voicesInfo.length;
              const usedIndexes = voicesInfo.map((voice) =>
                voices.indexOf(voice)
              );
              for (let i = 0; i < neededNoOfVoices; i++) {
                const randomIdx = createRandomNumber(
                  0,
                  voices.length - 1,
                  usedIndexes
                );
                const randomVoice = voices[randomIdx];
                newvoicesInfo.push(randomVoice);
                usedIndexes.push(randomIdx);
              }
            }
            setSecondaryVoiceInfo(newvoicesInfo);
            if (userDoc) {
              await updateUserProps(
                userDoc?.id,
                "coins",
                increment(-totalDash)
              );
              onProceedToNextScreen();
            }
          }}
          name={`${totalDash} DASH`}
          width={230}
          height={70}
        />
      </Box>
    </Stack>
  );
};

export default ChooseOpponentVoice;
