import { Stack, Fab } from "@mui/material";
import SmallImageMotionButton from "./Buttons/SmallImageMotionButton";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { getToneStatus, toggleMuteAudio } from "../hooks/useTonejs";
import { useEffect, useState } from "react";

type Props = {
  onStartClick: () => void;
};

const ScreenOne = ({ onStartClick }: Props) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const { isMuted } = getToneStatus();
    setIsMuted(isMuted);
  }, []);

  return (
    <Stack
      gap={4}
      height={"100%"}
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack mt={12} alignItems={"center"} gap={1}>
        <SmallImageMotionButton onClick={onStartClick} name="Start" />
        <Fab
          color="warning"
          size="small"
          onClick={() => {
            toggleMuteAudio();
            const { isMuted } = getToneStatus();
            setIsMuted(isMuted);
          }}
        >
          {isMuted ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
        </Fab>
      </Stack>
    </Stack>
  );
};

export default ScreenOne;
