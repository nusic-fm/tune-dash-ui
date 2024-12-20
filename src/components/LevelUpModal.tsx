import { Modal, Stack, Typography, Box, Badge } from "@mui/material";
import WebApp from "@twa-dev/sdk";
import axios from "axios";
import {
  numberToK,
  getXpForNextLevel,
  getDashForNextLevel,
  unlockAvailable,
} from "../helpers";
import { createOrder } from "../services/db/order.service";
import {
  rewardCoins,
  updateUserLevel,
  UserDoc,
} from "../services/db/user.service";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

type Props = {
  setShowLevelUpModal: (show: boolean) => void;
  userDoc: UserDoc;
};

function LevelUpModal({ setShowLevelUpModal, userDoc }: Props) {
  const nextLevel = userDoc.level + 1;
  const xpNeededForNextLevel = getXpForNextLevel(userDoc.level);
  const dashNeededForNextLevel = getDashForNextLevel(userDoc.level);
  const missingDash = dashNeededForNextLevel - userDoc.coins;
  const isMaxLevel = userDoc.level === 5;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal open onClose={() => setShowLevelUpModal(false)}>
      <Stack
        position={"absolute"}
        top={"50%"}
        left={"50%"}
        sx={{
          transform: "translate(-50%, -50%)",
          background: `url("/assets/tunedash/menu-rect.png")`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        width={290}
        height={330}
        display={"flex"}
        alignItems={"center"}
        p={3}
        gap={1}
      >
        <Typography variant="h5" fontWeight={900}>
          Level Up
        </Typography>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            background: `url("/assets/tunedash/wings.png")`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: 100,
            height: 70,
          }}
        >
          <Typography
            variant="h2"
            fontWeight={900}
            // color={"#fff"}
            fontSize={"2rem"}
            sx={{
              mt: 1,
            }}
          >
            {nextLevel}
          </Typography>
        </Box>
        {isMaxLevel ? (
          <Typography
            fontSize={"12px"}
            fontWeight={900}
            align="center"
            my="auto"
          >
            You've reached the maximum level for this race.
          </Typography>
        ) : (
          <Stack
            direction="row"
            justifyContent="space-between"
            gap={2}
            mt={1.5}
          >
            <Badge
              badgeContent={<DoneRoundedIcon fontSize="small" />}
              color="success"
            >
              <Stack
                gap={1}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  bgcolor: "#eecc9e",
                  borderRadius: 2,
                  boxShadow: "0px 3.02px 7.249px 0px rgba(0, 0, 0, 0.25)",
                  border: "2px solid #D79F72",
                }}
                px={2}
                py={1}
              >
                <Stack direction={"row"} gap={2} alignItems={"space-between"}>
                  <Stack alignItems={"center"}>
                    <Typography variant="h6">
                      {numberToK(userDoc?.xp || 0)}
                      <Typography variant="caption" fontSize={"10px"}>
                        /{numberToK(xpNeededForNextLevel)}
                      </Typography>
                    </Typography>
                  </Stack>
                </Stack>
                <Stack alignItems={"center"} gap={0.5}>
                  <Box
                    width={40}
                    height={40}
                    borderRadius={3}
                    // border={"1px solid #fff"}
                    sx={{
                      // bgcolor: LIGHT_YELLOW_COLOR,
                      backgroundImage: `url(/assets/tunedash/tasks-modal/xp.png)`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  ></Box>
                </Stack>
              </Stack>
            </Badge>
            <Badge
              badgeContent={
                missingDash > 0 ? (
                  <PriorityHighRoundedIcon fontSize="small" />
                ) : (
                  <DoneRoundedIcon fontSize="small" />
                )
              }
              color="error"
            >
              <Stack
                gap={1}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  bgcolor: "#eecc9e",
                  borderRadius: 2,
                  boxShadow: "0px 3.02px 7.249px 0px rgba(0, 0, 0, 0.25)",
                  border: "2px solid #D79F72",
                }}
                px={3}
                py={1}
              >
                <Stack direction={"row"} gap={2} alignItems={"space-between"}>
                  <Stack alignItems={"center"}>
                    <Typography variant="h6">
                      {numberToK(userDoc.coins)}
                      <Typography variant="caption" fontSize={"10px"}>
                        /{numberToK(dashNeededForNextLevel)}
                      </Typography>
                    </Typography>
                  </Stack>
                </Stack>
                <Stack alignItems={"center"} gap={0.5}>
                  <Box
                    width={40}
                    height={40}
                    borderRadius={3}
                    // border={"1px solid #fff"}
                    sx={{
                      // bgcolor: LIGHT_YELLOW_COLOR,
                      backgroundImage: `url(/assets/tunedash/dash-coin.png)`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  ></Box>
                </Stack>
              </Stack>
            </Badge>
          </Stack>
        )}
        <Box my="auto">
          {missingDash > 0 ? (
            <LoadingButton
              loading={isLoading}
              variant="contained"
              color="warning"
              endIcon={<img src="/assets/tunedash/stars.png" />}
              onClick={async () => {
                setIsLoading(true);
                // if missingDash is 800 then stars are 100: write the formula here
                const stars = Math.round(missingDash / 8);
                if (stars < 1)
                  return WebApp.showAlert(
                    "Invalid amount for eDash to stars conversion"
                  );
                const orderId = await createOrder(
                  userDoc.id,
                  userDoc.username,
                  getDashForNextLevel(userDoc.level),
                  null,
                  {
                    title: `Unlock Level ${nextLevel}`,
                    payType: "stars",
                    id: "unlock-level",
                    stars,
                    coins: missingDash,
                  }
                );
                const starsLink = await axios.post(
                  `${
                    import.meta.env.VITE_TG_BOT_SERVER
                  }/create-stars-invoice-link`,
                  {
                    // TODO: Support for multiple voices
                    title: `Unlock Level ${nextLevel}`,
                    description: `Unlock Level ${nextLevel} for `,
                    prices: [
                      {
                        label: `${missingDash} eDash`,
                        amount: stars,
                      },
                    ],
                    payload: { orderId, userId: userDoc.id },
                  }
                );
                WebApp.openInvoice(starsLink.data, async (status) => {
                  if (status === "paid") {
                    await rewardCoins(userDoc.id, "PURCHASE_DASH", missingDash);
                  } else if (status === "cancelled") {
                    WebApp.showAlert("Payment Cancelled");
                  } else if (status === "failed") {
                    WebApp.showAlert("Payment Failed");
                  }
                  setIsLoading(false);
                });
              }}
              disabled={isMaxLevel}
            >
              Unlock
            </LoadingButton>
          ) : (
            <LoadingButton
              loading={isLoading}
              variant="contained"
              color="success"
              onClick={async () => {
                if (unlockAvailable(userDoc.xp, userDoc.coins, userDoc.level)) {
                  setIsLoading(true);
                  await updateUserLevel(userDoc.id, nextLevel);
                  setIsLoading(false);
                } else {
                  WebApp.showAlert(
                    "You don't have enough XP or eDash to unlock this level"
                  );
                }
              }}
            >
              Unlock
            </LoadingButton>
          )}
        </Box>
      </Stack>
    </Modal>
  );
}

export default LevelUpModal;
