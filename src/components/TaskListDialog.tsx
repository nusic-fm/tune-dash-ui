import {
  Box,
  Button,
  Chip,
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
  rewardCoins,
  updateUserDocTimestamps,
  updateUserLevel,
  UserDoc,
} from "../services/db/user.service";
import { getLevelFromXp, hasTimestampCrossedOneDay } from "../helpers/index.js";
import TaskElement from "./TaskElement";
import StoreElement from "./StoreElement";
import { createOrder, updateOrder } from "../services/db/order.service";
import axios from "axios";
import WebApp from "@twa-dev/sdk";
import { logFirebaseEvent } from "../services/firebase.service";

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

export type TaskItem = {
  title: string;
  rewardAmount: number;
  isDaily: boolean;
  id: string;
  icon: string;
};

export type StoreItem = {
  title: string;
  icon: string;
  payType: "stars" | "coins";
  id: string;
  stars: number;
  coins: number;
  buyButtonText: string;
  oldPrice: string;
  discount?: string;
};

type StoreItemGroup = {
  title: string;
  items: StoreItem[];
  id: string;
};

const TaskListDialog = ({
  userDoc,
  open,
  onClose,
  onTaskButtonClick,
}: Props) => {
  const onReward = useCallback(() => {
    updateUserDocTimestamps(userDoc.id, "lastAdWatchedTimestamp");
    rewardCoins(userDoc.id, "WATCH_AD");
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
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      title: "Watch Ad",
      rewardAmount: getRewardTokensAmount("WATCH_AD"),
      isDaily: false,
      id: "WATCH_AD",
      icon: "ad.png",
    },
    {
      title: "Check In",
      rewardAmount: getRewardTokensAmount("DAILY_CHECK_IN"),
      isDaily: true,
      id: "DAILY_CHECK_IN",
      icon: "ton.png",
    },
    {
      title: "Daily Race",
      rewardAmount: getRewardTokensAmount("PLAY_DAILY_RACE"),
      isDaily: true,
      id: "PLAY_DAILY_RACE",
      icon: "race.png",
    },
  ]);
  const [storeItems, setStoreItems] = useState<StoreItemGroup[]>([
    {
      title: "Dash Packs",
      items: [
        {
          title: "1k Coins",
          icon: "pack-1.png",
          payType: "stars",
          id: "1k_coins",
          stars: 990,
          coins: 1000,
          buyButtonText: "$19.99",
          oldPrice: "$39.99",
          discount: "-50%",
        },
        {
          title: "10k Coins",
          icon: "pack-2.png",
          payType: "stars",
          id: "10k_coins",
          stars: 9000,
          coins: 10000,
          buyButtonText: "$199.99",
          oldPrice: "$399.99",
          discount: "-50%",
        },
        {
          title: "100k Coins",
          icon: "pack-3.png",
          payType: "stars",
          id: "100k_coins",
          stars: 8000,
          coins: 100000,
          buyButtonText: "$1999.99",
          oldPrice: "$3999.99",
          discount: "-50%",
        },
      ],
      id: "dash_packs",
    },
    {
      title: "Power-ups",
      items: [
        {
          buyButtonText: "Unlock",
          discount: "",
          id: "super_speed",
          icon: "lightening.png",
          oldPrice: "",
          payType: "coins",
          stars: 0,
          title: "Super Speed",
          coins: 15,
        },
        {
          buyButtonText: "Unlock",
          discount: "",
          id: "double_coins",
          icon: "x2.png",
          oldPrice: "",
          payType: "coins",
          stars: 0,
          title: "Double Coins",
          coins: 15,
        },
        {
          buyButtonText: "Unlock",
          discount: "",
          id: "marble_bomb",
          icon: "bomb.png",
          oldPrice: "",
          payType: "coins",
          stars: 0,
          title: "Marble Bomb",
          coins: 15,
        },
      ],
      id: "power_ups",
    },
  ]);

  useEffect(() => {
    const { lastDailyRacePlayedTimestamp, lastDailyCheckInTimestamp } = userDoc;
    setShowCheckIn(hasTimestampCrossedOneDay(lastDailyCheckInTimestamp));
    // setShowWatchAd(
    //   !lastAdWatchedTimestamp ||
    //     hasTimestampCrossedOneDay(lastAdWatchedTimestamp)
    // );
    setShowDailyRace(hasTimestampCrossedOneDay(lastDailyRacePlayedTimestamp));
  }, [userDoc, open]);

  const pointsBasedLevel = getLevelFromXp(userDoc.xp);

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
            width={"100%"}
            gap={2}
            sx={{ overflowY: "auto" }}
          >
            {showStore ? (
              <Stack width={"100%"} gap={1}>
                {storeItems.map((storeItemGroup, index) => {
                  return (
                    <Stack key={index} width={"100%"} gap={1}>
                      <Typography variant="h6" color={"#A54A19"} pl={1}>
                        {storeItemGroup.title}
                      </Typography>
                      <Stack
                        direction={"row"}
                        gap={1}
                        // justifyContent={"center"}
                        sx={{ overflowX: "auto", width: "100%" }}
                      >
                        {storeItemGroup.items.map((storeItem) => (
                          <StoreElement
                            key={storeItem.id}
                            storeItem={storeItem}
                            onClick={() => {}}
                            onBuyCoins={async () => {
                              if (storeItem.payType === "coins") {
                                logFirebaseEvent("powerup_purchase_attempt", {
                                  track_id: storeItem.id,
                                  amount: storeItem.stars,
                                  user_id: userDoc.id,
                                });
                                WebApp.showAlert("Coming Soon...");
                                return;
                              }
                              try {
                                const orderId = await createOrder(
                                  userDoc.id,
                                  userDoc.username,
                                  storeItem.stars,
                                  null,
                                  storeItem
                                );
                                const starsLink = await axios.post(
                                  `${
                                    import.meta.env.VITE_TG_BOT_SERVER
                                  }/create-stars-invoice-link`,
                                  {
                                    // TODO: Support for multiple voices
                                    title: `Buy ${storeItem.coins} eDash`,
                                    description: `Buy ${storeItem.coins} eDash for ${storeItem.stars} stars`,
                                    prices: [
                                      {
                                        label: `${storeItem.coins} eDash`,
                                        amount: storeItem.stars,
                                      },
                                    ],
                                    payload: { orderId, userId: userDoc.id },
                                  }
                                );
                                WebApp.openInvoice(
                                  starsLink.data,
                                  async (status) => {
                                    if (status === "paid") {
                                      await rewardCoins(
                                        userDoc.id,
                                        "PURCHASE_DASH",
                                        storeItem.coins
                                      );
                                      logFirebaseEvent(
                                        "voice_purchase_success",
                                        {
                                          track_id: storeItem.id,
                                          amount: storeItem.stars,
                                          coins: storeItem.coins,
                                          order_number: orderId,
                                        }
                                      );
                                      await updateOrder(orderId, "success");
                                      alert(
                                        `Payment Success, ${storeItem.coins} coins are added to your account`
                                      );
                                    } else if (status === "pending") {
                                      // TODO: payment pending
                                    } else {
                                      await updateOrder(orderId, "failed");
                                      logFirebaseEvent(
                                        "dash_purchase_failure",
                                        {
                                          track_id: storeItem.id,
                                          amount: storeItem.stars,
                                          order_number: orderId,
                                          user_id: userDoc.id,
                                        }
                                      );
                                      alert("Payment Failed");
                                    }
                                  }
                                );
                                logFirebaseEvent("dash_purchase_attempt", {
                                  track_id: storeItem.id,
                                  amount: storeItem.stars,
                                  order_number: orderId,
                                  user_id: userDoc.id,
                                });
                              } catch (e) {
                                alert("Error Occured, try again later");
                              }
                            }}
                            disabled={false}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            ) : (
              <Stack
                height={"90%"}
                width={"100%"}
                gap={2}
                direction={"row"}
                flexWrap={"wrap"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  overflowY: "auto",
                }}
              >
                {tasks.map((task) => (
                  <TaskElement
                    key={task.id}
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
                    task={task}
                  />
                ))}
              </Stack>
            )}
          </Stack>
          <Stack
            height={"10%"}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box
              sx={{
                width: 90,
                height: 38,
                background: `url(/assets/tunedash/tasks-modal/xp-holder.png)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              pl={2}
              position={"relative"}
            >
              <img
                src="/assets/tunedash/tasks-modal/xp.png"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  width: 25,
                  // height: 25,
                  transform: "translateY(-50%)",
                }}
              />
              <Typography variant="caption" align="center">
                {userDoc.xp}
              </Typography>
            </Box>
            {pointsBasedLevel === userDoc.level ? (
              <Chip
                label={`Level ${pointsBasedLevel}`}
                size="small"
                color="primary"
              />
            ) : (
              <Chip
                label="Level UP!!!"
                size="small"
                color="success"
                clickable
                onClick={async () => {
                  if (
                    pointsBasedLevel &&
                    pointsBasedLevel > (userDoc.level || 0) &&
                    userDoc.id
                  ) {
                    await updateUserLevel(userDoc.id, pointsBasedLevel);
                  }
                }}
              />
            )}
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
                {userDoc.coins || 0}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskListDialog;
