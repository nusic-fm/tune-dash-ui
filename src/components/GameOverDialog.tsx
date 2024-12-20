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
      <Stack
        gap={1}
        width={"100%"}
        sx={{
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: 1,
          padding: 1,
        }}
        alignItems={"center"}
        mt="auto"
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          gap={1}
          alignItems={"center"}
          mt={2}
        >
          <Typography
            color={dashEarnings > 0 ? "#00e547" : "red"}
            fontSize={"1.75rem"}
          >
            +{dashEarnings}
          </Typography>
          <img src="/assets/tunedash/coins.png" alt="coins" />
          {dashEarnings > 0 && (
            <Button
              endIcon={<SlideshowIcon />}
              color="warning"
              variant="contained"
              size="small"
              onClick={showAd}
            >
              x2
            </Button>
          )}
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          gap={1}
          alignItems={"center"}
        >
          <Typography color={"#00e547"} fontSize={"2rem"}>
            +{xpEarnings}
          </Typography>
          <img
            src="/assets/tunedash/tasks-modal/xp.png"
            alt="xp"
            style={{ width: 38 }}
          />
        </Box>
      </Stack>
      <Stack>
        <LongImageMotionButton name="Play again" onClick={onPlayAgain} />
        <LongImageMotionButton name="New Race" onClick={onNewRace} />
      </Stack>
    </Box>
  );
};

export default GameOverDialog;
