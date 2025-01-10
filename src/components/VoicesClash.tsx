import { Stack, Box, Typography, Badge } from "@mui/material";
import { createRandomNumber, getVoiceAvatarPath } from "../helpers";
import { useEffect, useState } from "react";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import BouncingBallsLoading from "./BouncingBallsLoading";
// import axios from "axios";
// import { createOrder } from "../services/db/order.service";
import { UserDoc } from "../services/db/user.service";
// import WebApp from "@twa-dev/sdk";
import { logFirebaseEvent } from "../services/firebase.service";

type Props = {
  primaryVoiceInfo: VoiceV1Cover[];
  secondaryVoiceInfo: VoiceV1Cover[] | null;
  setSecondaryVoiceInfo: React.Dispatch<
    React.SetStateAction<VoiceV1Cover[] | null>
  >;
  onChooseOpponent: () => void;
  onStartRaceClick: () => void;
  voices: VoiceV1Cover[];
  downloadProgress: number;
  userDoc: UserDoc | null;
  selectedCoverDocId: string;
  noOfVoices: number;
};

const VoicesClash = ({
  voices,
  primaryVoiceInfo,
  secondaryVoiceInfo,
  onChooseOpponent,
  setSecondaryVoiceInfo,
  onStartRaceClick,
  downloadProgress,
  selectedCoverDocId,
  noOfVoices,
}: Props) => {
  const [readyToStartRace, setReadyToStartRace] = useState(false);

  const primaryVoiceIds = primaryVoiceInfo.map((v) => v.id);
  const secondaryVoiceIds = secondaryVoiceInfo?.map((v) => v.id);

  useEffect(() => {
    if (secondaryVoiceIds && readyToStartRace) {
      onStartRaceClick();
    }
  }, [secondaryVoiceIds, readyToStartRace]);

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
    >
      <img src="/assets/tunedash/tune-dash.png" />
      <Stack minHeight={340} gap={2} justifyContent={"center"}>
        <Box display={"flex"} alignItems={"center"} position={"relative"}>
          <Box
            width={160}
            // height={160}
            position={"relative"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexWrap={"wrap"}
          >
            {primaryVoiceIds.map((voiceId) => (
              <img
                key={voiceId}
                src={getVoiceAvatarPath(voiceId)}
                style={{
                  borderRadius: "50%",
                  outline: "8px solid #04344d",
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            ))}
          </Box>
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
            <img src="/assets/tunedash/vs.png" width={90} height={91} />
          </Box>
          {secondaryVoiceIds?.length ? (
            <Box
              width={160}
              // height={160}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              {secondaryVoiceIds.map((voiceId) => (
                <img
                  key={voiceId}
                  src={getVoiceAvatarPath(voiceId)}
                  style={{
                    borderRadius: "50%",
                    outline: "8px solid #04344d",
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              width={160}
              // height={160}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              {new Array(noOfVoices).fill(0).map((_, idx) => (
                <Box
                  key={idx}
                  width={80}
                  height={80}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  sx={{
                    bgcolor: "white",
                    borderRadius: "50%",
                    outline: "8px solid #04344d",
                  }}
                >
                  <img src="/assets/tunedash/question-mark.png" width={35} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Stack>
      {secondaryVoiceIds && readyToStartRace ? (
        <Stack mt={2} alignItems={"center"}>
          <Typography color={"#fff"} align="center">
            Downloading audio...
          </Typography>
          <Typography variant="h6" color={"#fff"} align="center">
            {downloadProgress.toFixed(0)}%
          </Typography>
          <BouncingBallsLoading />
        </Stack>
      ) : (
        <LongImageMotionButton
          onClick={() => {
            const usedIndexes: number[] = [];
            primaryVoiceIds.map((id) => {
              usedIndexes.push(voices.map((v) => v.id).indexOf(id));
            });
            if (!secondaryVoiceIds?.length) {
              const selectedVoices = [];
              for (let i = 0; i < noOfVoices; i++) {
                const randomIdx = createRandomNumber(
                  0,
                  voices.length - 1,
                  usedIndexes
                );
                selectedVoices.push(voices[randomIdx]);
                usedIndexes.push(randomIdx);
              }
              setSecondaryVoiceInfo(selectedVoices);
            }
            // onChooseOpponent(selectedVoices);
            logFirebaseEvent("race_start", {
              track_id: selectedCoverDocId,
              primary_voice_id: primaryVoiceIds[0],
              random_secondary_voice_id: secondaryVoiceIds?.[0],
            });
            setReadyToStartRace(true);
          }}
          name={"Start Race"}
          width={290}
          height={93}
        />
      )}
      {!readyToStartRace && !secondaryVoiceIds?.length && (
        <Badge
          badgeContent={
            <Box
              sx={{
                borderRadius: "50%",
                width: 30,
                height: 30,
                backgroundImage: "url(/assets/tunedash/dash-coin.png)",
                backgroundSize: "cover",
                position: "absolute",
                top: 15,
                left: -30,
              }}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            ></Box>
          }
        >
          <LongImageMotionButton
            // onClick={() => {
            //   logFirebaseEvent("choose_opponent", {
            //     track_id: selectedCoverDocId,
            //     primary_voice_id: primaryVoiceIds[0],
            //   });
            //   setShowOpponentVoiceSelection(true);
            // }}
            onClick={onChooseOpponent}
            name={"Choose Opponent"}
            width={290}
            height={93}
          />
        </Badge>
      )}
    </Stack>
  );
};

export default VoicesClash;
