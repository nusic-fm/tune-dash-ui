import {
  Stack,
  Box,
  Badge,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { createRandomNumber, getVoiceAvatarPath } from "../helpers";
import { useEffect, useState } from "react";
import ChooseVoice from "./ChooseVoice";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import BouncingBallsLoading from "./BouncingBallsLoading";
import axios from "axios";
import { createOrder } from "../services/db/order.service";
import { updatePurchasedVoice } from "../services/db/user.service";
import WebApp from "@twa-dev/sdk";

type Props = {
  primaryVoiceId: string;
  secondaryVoiceId: string | null;
  onChooseOpponent: (voiceInfo: VoiceV1Cover) => void;
  onStartRaceClick: () => void;
  voices: VoiceV1Cover[];
  downloadProgress: number;
  userInfo: { id: string; fn: string } | null;
};

const voiceWidth = 140;
const VoicesClash = ({
  voices,
  primaryVoiceId,
  secondaryVoiceId,
  onChooseOpponent,
  onStartRaceClick,
  downloadProgress,
  userInfo,
}: Props) => {
  const [showOpponentVoiceSelection, setShowOpponentVoiceSelection] =
    useState(false);
  const [readyToStartRace, setReadyToStartRace] = useState(false);
  const [cost, setCost] = useState(0);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);

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
          onChooseOpponent={(voiceInfo, cost) => {
            setCost(cost);
            onChooseOpponent(voiceInfo);
          }}
        />
      )}
      {!showOpponentVoiceSelection &&
        (secondaryVoiceId && readyToStartRace ? (
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
            onClick={async () => {
              if (
                secondaryVoiceId &&
                showOpponentVoiceSelection &&
                !readyToStartRace &&
                userInfo
              ) {
                try {
                  const orderId = await createOrder(
                    userInfo.id,
                    voices[voices.map((v) => v.id).indexOf(secondaryVoiceId)],
                    cost
                  );
                  const paylod = {
                    merchantOrderNo: orderId,
                    userId: userInfo.id,
                    orderAmount: cost,
                  };
                  const webUrlRes = await axios.post(
                    `${import.meta.env.VITE_VOX_COVER_SERVER}/aeon-signature`,
                    paylod
                  );
                  const webUrl = webUrlRes.data.webUrl;
                  if (WebApp) {
                    // WebApp.openTelegramLink(webUrl);
                    WebApp.openLink(webUrl);
                    setIsWaitingForPayment(true);
                    setInterval(async () => {
                      const orderStatus = await axios.post(
                        `https://sbx-crypto-payment-api.aeon.xyz/open/api/payment/query`,
                        {
                          merchantOrderNo: orderId,
                          appId: import.meta.env.VITE_AEON_APP_ID,
                          sign: webUrlRes.data.sign,
                        }
                      );
                      if (orderStatus.data?.orderStatus === "COMPLETED") {
                        await updatePurchasedVoice(
                          userInfo.id,
                          secondaryVoiceId
                        );
                        setIsWaitingForPayment(false);
                        setReadyToStartRace(true);
                      }
                    }, 3000);
                  }
                  // window.open(webUrl, "_blank");
                  // window.location.href = webUrl;
                  // TODO: Show it in a popup without interuppting the music
                } catch (e) {
                  alert("Error Occured, try again later");
                } finally {
                  // setReadyToStartRace(true);
                }
              } else if (secondaryVoiceId && showOpponentVoiceSelection) {
                setShowOpponentVoiceSelection(false);
                setReadyToStartRace(true);
              } else {
                setShowOpponentVoiceSelection(true);
              }
            }}
            name={
              secondaryVoiceId && showOpponentVoiceSelection
                ? readyToStartRace
                  ? "Start Race"
                  : "Purchase Voice"
                : "Choose Opponent"
            }
            width={290}
            height={93}
          />
        </Badge>
      )}
      <Dialog open={isWaitingForPayment}>
        <DialogContent>
          <Stack alignItems={"center"} justifyContent={"center"} my={4}>
            <CircularProgress />
            <Typography color={"#fff"}>
              Waiting for the payment status...
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default VoicesClash;
