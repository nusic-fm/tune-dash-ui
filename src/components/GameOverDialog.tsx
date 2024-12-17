import { Box, Button, Stack, Typography } from "@mui/material";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
// import LiveTvIcon from "@mui/icons-material/LiveTv";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { useAdsgram } from "../hooks/useAdsgram";

type Props = {
  onPlayAgain: () => void;
  onNewRace: () => void;
  onWatchRewardVideo: (newReward: number) => void;
  dashEarnings: number;
  xpEarnings: number;
};

const GameOverDialog = ({
  onPlayAgain,
  onNewRace,
  onWatchRewardVideo,
  dashEarnings,
  xpEarnings,
}: Props) => {
  const showAd = useAdsgram({
    blockId: import.meta.env.VITE_WINNING_REWARD_MULTIPLIER_BLOCK_ID,
    onReward: () => {
      onWatchRewardVideo(dashEarnings);
    },
    onError: () => {
      //
    },
  });
  return (
    <Box
      position={"absolute"}
      top={0}
      left={0}
      width={"100%"}
      height={"95%"}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      flexDirection={"column"}
      pt={1}
      zIndex={999}
      gap={2}
    >
      <Stack gap={1}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          gap={1}
          alignItems={"center"}
          mt={2}
        >
          <Typography color={"#00e547"}>+ {dashEarnings}</Typography>
          <img src="/assets/tunedash/coins.png" alt="coins" />
          <Button
            endIcon={<SlideshowIcon />}
            color="warning"
            variant="contained"
            size="small"
            onClick={showAd}
          >
            x2
          </Button>
        </Box>
        <Typography color={"#00e547"}>+ {xpEarnings} XP</Typography>
      </Stack>
      <Stack>
        <LongImageMotionButton name="Play again" onClick={onPlayAgain} />
        <LongImageMotionButton name="New Race" onClick={onNewRace} />
      </Stack>
    </Box>
  );
};

export default GameOverDialog;
