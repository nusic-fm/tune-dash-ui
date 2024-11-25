import { Stack, Box, Badge, Typography } from "@mui/material";
import { createRandomNumber, getVoiceAvatarPath } from "../helpers";
import { useEffect, useState } from "react";
import ChooseVoice from "./ChooseVoice";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import BouncingBallsLoading from "./BouncingBallsLoading";
import axios from "axios";
import { createOrder } from "../services/db/order.service";
import { updatePurchasedVoice, User } from "../services/db/user.service";
import WebApp from "@twa-dev/sdk";
import { logFirebaseEvent } from "../services/firebase.service";

type Props = {
  primaryVoiceInfo: VoiceV1Cover;
  secondaryVoiceInfo: VoiceV1Cover | null;
  onChooseOpponent: (voiceInfo: VoiceV1Cover) => void;
  onStartRaceClick: () => void;
  voices: VoiceV1Cover[];
  downloadProgress: number;
  userInfo: User | null;
  selectedCoverDocId: string;
  showOpponentVoiceSelection: boolean;
  setShowOpponentVoiceSelection: (show: boolean) => void;
};

const voiceWidth = 140;
const VoicesClash = ({
  voices,
  primaryVoiceInfo,
  secondaryVoiceInfo,
  onChooseOpponent,
  onStartRaceClick,
  downloadProgress,
  userInfo,
  selectedCoverDocId,
  showOpponentVoiceSelection,
  setShowOpponentVoiceSelection,
}: Props) => {
  const [readyToStartRace, setReadyToStartRace] = useState(false);
  const [cost, setCost] = useState(0);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState("");

  const primaryVoiceId = primaryVoiceInfo.id;
  const secondaryVoiceId = secondaryVoiceInfo?.id;

  useEffect(() => {
    if (secondaryVoiceId && readyToStartRace) {
      onStartRaceClick();
    }
  }, [secondaryVoiceId, readyToStartRace]);

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
    >
      {!showOpponentVoiceSelection && (
        <img src="/assets/tunedash/tune-dash.png" />
      )}

      <Stack height={220} gap={2} justifyContent={"center"}>
        <Box display={"flex"} alignItems={"center"} position={"relative"}>
          <Box width={voiceWidth} height={voiceWidth} position={"relative"}>
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
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Typography
            color={"#f0f0f0"}
            fontSize={12}
            fontWeight={900}
            textAlign={"center"}
            width={140}
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {primaryVoiceInfo.name}
          </Typography>
          {secondaryVoiceId ? (
            <Typography
              color={"#f0f0f0"}
              fontSize={12}
              fontWeight={900}
              textAlign={"center"}
              width={140}
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {secondaryVoiceInfo?.name}
            </Typography>
          ) : (
            <Box width={140}></Box>
          )}
        </Box>
      </Stack>
      {showOpponentVoiceSelection && (
        <ChooseVoice
          voices={voices}
          filterOutVoiceIds={[primaryVoiceId]}
          selectedCoverDocId={selectedCoverDocId}
          selectedVoiceId={secondaryVoiceId || ""}
          onChooseOpponent={(voiceInfo, cost) => {
            setCost(cost);
            onChooseOpponent(voiceInfo);
          }}
          purchasedVoices={userInfo?.purchasedVoices || []}
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
              logFirebaseEvent("race_start", {
                track_id: selectedCoverDocId,
                primary_voice_id: primaryVoiceInfo.id,
                random_secondary_voice_id: secondaryVoiceInfo?.id,
              });
              setReadyToStartRace(true);
            }}
            name={"Start Race"}
            width={290}
            height={93}
          />
        ))}
      {!readyToStartRace && !showOpponentVoiceSelection && (
        <Badge
          badgeContent={
            <Box
              sx={{
                borderRadius: "50%",
                width: 30,
                height: 30,
                backgroundImage: "url(/assets/tunedash/bubble.png)",
                backgroundSize: "contain",
                position: "absolute",
                top: 20,
                left: -20,
              }}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography variant="h6" color={"#000"}>
                $
              </Typography>
            </Box>
          }
        >
          <LongImageMotionButton
            onClick={() => {
              logFirebaseEvent("choose_opponent", {
                track_id: selectedCoverDocId,
                primary_voice_id: primaryVoiceInfo.id,
              });
              setShowOpponentVoiceSelection(true);
            }}
            name={"Choose Opponent"}
            width={290}
            height={93}
          />
        </Badge>
      )}
      {showOpponentVoiceSelection && secondaryVoiceId && (
        <Box
          position={"absolute"}
          bottom={0}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          zIndex={99}
        >
          <LongImageMotionButton
            onClick={async () => {
              if (!userInfo) return alert("Support only on Telegram Mini App");
              if (!cost) return alert("This voice is not available yet");
              if (
                (userInfo?.purchasedVoices || []).includes(
                  `${selectedCoverDocId}_${secondaryVoiceId}`
                ) ||
                userInfo?.isVip
              ) {
                logFirebaseEvent("race_start", {
                  track_id: selectedCoverDocId,
                  primary_voice_id: primaryVoiceInfo.id,
                  secondary_voice_id: secondaryVoiceId,
                  is_unlocked_race: true,
                });
                setShowOpponentVoiceSelection(false);
                setReadyToStartRace(true);
              } else if (
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
                    // WebApp.openLink(webUrl);
                    const interval = setInterval(async () => {
                      const orderStatus = await axios.post(
                        `https://crypto-payment.alchemytech.cc/open/api/payment/query`,
                        {
                          merchantOrderNo: orderId,
                          appId: import.meta.env.VITE_AEON_APP_ID,
                          sign: webUrlRes.data.sign,
                        }
                      );
                      if (
                        orderStatus.data?.model?.orderStatus === "COMPLETED"
                      ) {
                        logFirebaseEvent("voice_purchase_success", {
                          track_id: selectedCoverDocId,
                          primary_voice_id: primaryVoiceInfo.id,
                          voice_id: secondaryVoiceId,
                          amount: cost,
                          order_number: orderId,
                        });
                        await updatePurchasedVoice(
                          userInfo.id,
                          `${selectedCoverDocId}_${secondaryVoiceId}`
                        );
                        setIsWaitingForPayment("");
                        setShowOpponentVoiceSelection(false);
                        setReadyToStartRace(true);
                        clearInterval(interval);
                      } else if (
                        ["CLOSE", "TIMEOUT", "FAILED", "DELAY_FAILED"].includes(
                          orderStatus.data?.model?.orderStatus
                        )
                      ) {
                        logFirebaseEvent("voice_purchase_failure", {
                          track_id: selectedCoverDocId,
                          voice_id: secondaryVoiceId,
                          amount: cost,
                          order_number: orderId,
                          status: orderStatus.data?.model?.orderStatus,
                        });
                        WebApp.showAlert("Payment Failed");
                        clearInterval(interval);
                      }
                    }, 3000);
                  }
                  logFirebaseEvent("voice_purchase_attempt", {
                    track_id: selectedCoverDocId,
                    voice_id: secondaryVoiceId,
                    amount: cost,
                    order_number: orderId,
                  });
                  setIsWaitingForPayment(webUrl);
                } catch (e) {
                  alert("Error Occured, try again later");
                }
              } else {
                setShowOpponentVoiceSelection(true);
              }
            }}
            name={
              readyToStartRace ||
              (userInfo?.purchasedVoices || []).includes(
                `${selectedCoverDocId}_${secondaryVoiceId}`
              ) ||
              userInfo?.isVip
                ? "Start Race"
                : "Unlock Race"
            }
            width={290}
            height={93}
          />
        </Box>
      )}
      {/* <Dialog open={isWaitingForPayment}>
        <DialogContent>
          <Stack alignItems={"center"} justifyContent={"center"} my={4}>
            <CircularProgress />
            <Typography color={"#fff"}>
              Waiting for the payment status...
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog> */}
      {!!isWaitingForPayment && (
        <Box
          position={"fixed"}
          left={0}
          top={0}
          width={"100vw"}
          height={"100vh"}
          zIndex={99999}
          bgcolor={"#000"}
          sx={{ overflow: "hidden" }}
        >
          <iframe
            src={isWaitingForPayment}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </Box>
      )}
    </Stack>
  );
};

export default VoicesClash;
