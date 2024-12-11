import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useCallback, useEffect, useState } from "react";
import { useAdsgram } from "../hooks/useAdsgram";
import {
  getRewardTokensAmount,
  rewardInGameTokens,
  updateUserDocTimestamps,
  UserDoc,
} from "../services/db/user.service";
import { hasTimestampCrossedOneDay } from "../helpers/index.js";
import TaskElement from "./TaskElement";

type Props = {
  userDoc: UserDoc;
  open: boolean;
  onClose: () => void;
  onTaskButtonClick: (task: string) => void;
};

export const DialogTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const TaskListDialog = ({
  userDoc,
  open,
  onClose,
  onTaskButtonClick,
}: Props) => {
  const onReward = useCallback(() => {
    updateUserDocTimestamps(userDoc.id, "lastAdWatchedTimestamp");
    rewardInGameTokens(userDoc.id, "WATCH_AD");
  }, []);
  const onError = useCallback((result: any) => {
    setShowWatchAd(true);
    alert(JSON.stringify(result, null, 4));
  }, []);

  const showAd = useAdsgram({
    blockId: import.meta.env.VITE_DAILY_REWARDS_ADSGRAM_BLOCK_ID,
    onReward,
    onError,
  });
  const [showWatchAd, setShowWatchAd] = useState(true);
  const [showDailyRace, setShowDailyRace] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [tasks, setTasks] = useState<
    {
      title: string;
      rewardAmount: number;
      isDaily: boolean;
      id: string;
    }[]
  >([
    {
      title: "Watch Ad",
      rewardAmount: getRewardTokensAmount("WATCH_AD"),
      isDaily: false,
      id: "WATCH_AD",
    },
    {
      title: "Check In",
      rewardAmount: getRewardTokensAmount("DAILY_CHECK_IN"),
      isDaily: true,
      id: "DAILY_CHECK_IN",
    },
    {
      title: "Daily Race",
      rewardAmount: getRewardTokensAmount("PLAY_DAILY_RACE"),
      isDaily: true,
      id: "PLAY_DAILY_RACE",
    },
  ]);

  useEffect(() => {
    const { lastDailyRacePlayedTimestamp, lastDailyCheckInTimestamp } = userDoc;
    setShowCheckIn(
      !lastDailyCheckInTimestamp ||
        hasTimestampCrossedOneDay(lastDailyCheckInTimestamp)
    );
    // setShowWatchAd(
    //   !lastAdWatchedTimestamp ||
    //     hasTimestampCrossedOneDay(lastAdWatchedTimestamp)
    // );
    setShowDailyRace(
      !lastDailyRacePlayedTimestamp ||
        hasTimestampCrossedOneDay(lastDailyRacePlayedTimestamp)
    );
  }, [userDoc, open]);

  return (
    <Dialog
      open={open}
      TransitionComponent={DialogTransition}
      keepMounted
      fullWidth
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          margin: 0,
          boxShadow: "none",
          background: `url(/assets/tunedash/tasks-modal/${
            showStore ? "store" : "tasks"
          }-bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maxWidth: "unset",
          width: 344,
          // backgroundRepeat: "no-repeat",
          // All child with background transparent
          "& > *": {
            background: "transparent",
          },
        },
      }}
    >
      <Box
        position={"absolute"}
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"65px"}
        alignItems={"center"}
        left={0}
        top={0}
      >
        <Button
          sx={{ width: "50%", height: "100%", opacity: 0 }}
          onClick={() => {
            setShowStore(false);
          }}
        ></Button>
        <Button
          sx={{ width: "50%", height: "100%", opacity: 0 }}
          onClick={() => {
            setShowStore(true);
          }}
        ></Button>
      </Box>
      <DialogContent>
        <Box height={"400px"} mt={8}>
          <Stack
            height={"90%"}
            gap={2}
            direction={"row"}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              overflowY: "auto",
            }}
          >
            {showStore ? (
              <Box></Box>
            ) : (
              tasks.map((task) => (
                <TaskElement
                  onClick={async () => {
                    if (task.id === "WATCH_AD") {
                      await showAd();
                    } else if (task.id === "DAILY_CHECK_IN") {
                      setShowCheckIn(false);
                    } else if (task.id === "PLAY_DAILY_RACE") {
                      setShowDailyRace(false);
                      onTaskButtonClick(task.id);
                      onClose();
                    }
                  }}
                  disabled={
                    task.id === "WATCH_AD"
                      ? !showWatchAd
                      : task.id === "DAILY_CHECK_IN"
                      ? showCheckIn
                      : !showDailyRace
                  }
                  label={task.title}
                  rewardAmount={task.rewardAmount}
                  isDaily={task.isDaily}
                />
              ))
            )}
          </Stack>
          <Stack
            height={"10%"}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              sx={{
                width: 94,
                height: 38,
                background: `url(/assets/tunedash/tasks-modal/token-holdings-bg.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              pl={2}
            >
              <Typography variant="caption" align="center">
                {userDoc.inGameTokensCount}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskListDialog;
