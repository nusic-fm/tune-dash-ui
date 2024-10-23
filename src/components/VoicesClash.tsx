import { Stack, Box } from "@mui/material";
import { getVoiceAvatarPath } from "../helpers";
import { useState } from "react";
import ChooseVoice from "./ChooseVoice";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";

type Props = {
  primaryVoiceId: string;
  secondaryVoiceId: string | null;
  onChooseOpponent: (voiceInfo: VoiceV1Cover) => void;
  onStartRaceClick: () => void;
  onSetGameBg: () => void;
  voices: VoiceV1Cover[];
};

const voiceWidth = 140;
const VoicesClash = ({
  voices,
  primaryVoiceId,
  secondaryVoiceId,
  onChooseOpponent,
  onStartRaceClick,
  onSetGameBg,
}: Props) => {
  const [showOpponentVoiceSelection, setShowOpponentVoiceSelection] =
    useState(false);

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
      {((!secondaryVoiceId && !showOpponentVoiceSelection) ||
        secondaryVoiceId) && (
        <LongImageMotionButton
          onClick={() => {
            if (secondaryVoiceId && !showOpponentVoiceSelection) {
              onStartRaceClick();
            } else if (secondaryVoiceId && showOpponentVoiceSelection) {
              onSetGameBg();
              setShowOpponentVoiceSelection(false);
            } else {
              setShowOpponentVoiceSelection(true);
            }
          }}
          name={
            secondaryVoiceId && !showOpponentVoiceSelection
              ? "Start Race"
              : secondaryVoiceId && showOpponentVoiceSelection
              ? "Proceed"
              : "Choose Opponent"
          }
          width={secondaryVoiceId ? 230 : 290}
          height={secondaryVoiceId ? 75 : 93}
        />
      )}
    </Stack>
  );
};

export default VoicesClash;
