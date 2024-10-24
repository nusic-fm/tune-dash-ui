import { Stack, Box, Badge, Typography } from "@mui/material";
import { createRandomNumber, getVoiceAvatarPath } from "../helpers";
import { useEffect, useState } from "react";
import ChooseVoice from "./ChooseVoice";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import BouncingBallsLoading from "./BouncingBallsLoading";

type Props = {
  primaryVoiceId: string;
  secondaryVoiceId: string | null;
  onChooseOpponent: (voiceInfo: VoiceV1Cover) => void;
  onStartRaceClick: () => void;
  voices: VoiceV1Cover[];
};

const voiceWidth = 140;
const VoicesClash = ({
  voices,
  primaryVoiceId,
  secondaryVoiceId,
  onChooseOpponent,
  onStartRaceClick,
}: Props) => {
  const [showOpponentVoiceSelection, setShowOpponentVoiceSelection] =
    useState(false);
  const [readyToStartRace, setReadyToStartRace] = useState(false);

  useEffect(() => {
    if (secondaryVoiceId && readyToStartRace) {
      onStartRaceClick();
    }
  }, [secondaryVoiceId, readyToStartRace]);

  return (
    <Stack
      width={"100%"}
      height={"calc(100% - 95px)"}
      display={"flex"}
      justifyContent={"start"}
      alignItems={"center"}
    >
      <img src="/assets/tunedash/tune-dash.png" />
      <Box
        display={"flex"}
        alignItems={"center"}
        height={200}
        position={"relative"}
      >
        <Box width={voiceWidth} height={voiceWidth}>
          <img
            src={getVoiceAvatarPath(primaryVoiceId)}
            style={{
              borderRadius: "50%",
              outline: "8px solid #04344d",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
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
        {secondaryVoiceId ? (
          <Box width={voiceWidth} height={voiceWidth}>
            <img
              src={getVoiceAvatarPath(secondaryVoiceId)}
              style={{
                borderRadius: "50%",
                outline: "8px solid #04344d",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "50%",
              outline: "8px solid #04344d",
            }}
            width={voiceWidth}
            height={voiceWidth}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <img src="/assets/tunedash/question-mark.png" />
          </Box>
        )}
      </Box>
      {showOpponentVoiceSelection && (
        <ChooseVoice
          voices={voices}
          selectedVoiceId={secondaryVoiceId || ""}
          setSelectedVoiceId={onChooseOpponent}
        />
      )}
      {!showOpponentVoiceSelection &&
        (secondaryVoiceId && readyToStartRace ? (
          <BouncingBallsLoading />
        ) : (
          <LongImageMotionButton
            onClick={() => {
              onChooseOpponent(
                voices[
                  createRandomNumber(
                    0,
                    voices.length - 1,
                    voices.map((v) => v.id).indexOf(primaryVoiceId)
                  )
                ]
              );
              setReadyToStartRace(true);
            }}
            name={"Start Race"}
            width={290}
            height={93}
          />
        ))}
      {!readyToStartRace && (
        <Badge
          badgeContent={
            !showOpponentVoiceSelection ? (
              <Box
                sx={{
                  borderRadius: "50%",
                  width: 25,
                  height: 25,
                  backgroundColor: "#000",
                  position: "absolute",
                  top: 20,
                  left: -20,
                }}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography variant="h6" color={"#fff"}>
                  $
                </Typography>
              </Box>
            ) : null
          }
        >
          <LongImageMotionButton
            onClick={() => {
              if (secondaryVoiceId && showOpponentVoiceSelection) {
                setShowOpponentVoiceSelection(false);
                setReadyToStartRace(true);
              } else {
                setShowOpponentVoiceSelection(true);
              }
            }}
            name={
              secondaryVoiceId && showOpponentVoiceSelection
                ? "Start Race"
                : "Choose Opponent"
            }
            width={290}
            height={93}
          />
        </Badge>
      )}
    </Stack>
  );
};

export default VoicesClash;
