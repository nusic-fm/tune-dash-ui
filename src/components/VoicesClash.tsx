import { Stack, Box, Typography } from "@mui/material";
import { createRandomNumber, getVoiceAvatarPath } from "../helpers";
import { useEffect, useState } from "react";
import ChooseVoice from "./ChooseVoice";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import BouncingBallsLoading from "./BouncingBallsLoading";
// import axios from "axios";
// import { createOrder } from "../services/db/order.service";
import { UserDoc } from "../services/db/user.service";
// import WebApp from "@twa-dev/sdk";
import { logFirebaseEvent } from "../services/firebase.service";

type Props = {
  primaryVoiceInfo: VoiceV1Cover[];
  secondaryVoiceInfo: VoiceV1Cover[] | null;
  onChooseOpponent: (voiceInfo: VoiceV1Cover[]) => void;
  onStartRaceClick: () => void;
  voices: VoiceV1Cover[];
  downloadProgress: number;
  userDoc: UserDoc | null;
  selectedCoverDocId: string;
  showOpponentVoiceSelection: boolean;
  setShowOpponentVoiceSelection: (show: boolean) => void;
  noOfVoices: number;
};

const voiceWidth = 140;
const VoicesClash = ({
  voices,
  primaryVoiceInfo,
  secondaryVoiceInfo,
  onChooseOpponent,
  onStartRaceClick,
  downloadProgress,
  userDoc,
  selectedCoverDocId,
  showOpponentVoiceSelection,
  setShowOpponentVoiceSelection,
  noOfVoices,
}: Props) => {
  const [readyToStartRace, setReadyToStartRace] = useState(false);
  const [cost, setCost] = useState(0);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState("");

  const primaryVoiceIds = primaryVoiceInfo.map((v) => v.id);
  const secondaryVoiceIds = secondaryVoiceInfo?.map((v) => v.id);

  useEffect(() => {
    if (secondaryVoiceIds && readyToStartRace) {
      onStartRaceClick();
    }
  }, [secondaryVoiceIds, readyToStartRace]);

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

      <Stack height={320} gap={2} justifyContent={"center"}>
        <Box display={"flex"} alignItems={"center"} position={"relative"}>
          <Box
            width={160}
            height={160}
            position={"relative"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexWrap={"wrap"}
          >
            {primaryVoiceIds.map((voiceId) => (
              <img
                key={voiceId}
                src={getVoiceAvatarPath(voiceId)}
                style={{
                  borderRadius: "50%",
                  outline: "8px solid #04344d",
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            ))}
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
          {secondaryVoiceIds?.length ? (
            <Box
              width={160}
              height={160}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              {secondaryVoiceIds.map((voiceId) => (
                <img
                  key={voiceId}
                  src={getVoiceAvatarPath(voiceId)}
                  style={{
                    borderRadius: "50%",
                    outline: "8px solid #04344d",
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              width={160}
              height={160}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              {new Array(noOfVoices).fill(0).map((_, idx) => (
                <Box
                  key={idx}
                  width={80}
                  height={80}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  sx={{
                    bgcolor: "white",
                    borderRadius: "50%",
                    outline: "8px solid #04344d",
                  }}
                >
                  <img src="/assets/tunedash/question-mark.png" width={35} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
        {/* <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
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
            {primaryVoiceInfo?.[0].name}
          </Typography>
          {secondaryVoiceIds?.length ? (
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
              {secondaryVoiceInfo?.[0].name}
            </Typography>
          ) : (
            <Box width={140}></Box>
          )}
        </Box> */}
      </Stack>
      {showOpponentVoiceSelection && (
        <ChooseVoice
          voices={voices}
          filterOutVoiceIds={primaryVoiceIds}
          selectedCoverDocId={selectedCoverDocId}
          selectedVoiceId={secondaryVoiceIds?.[0] || ""}
          onChooseOpponent={(voiceInfo, cost) => {
            setCost(cost);
            onChooseOpponent([voiceInfo]);
          }}
          purchasedVoices={userDoc?.purchasedVoices || []}
        />
      )}
      {!showOpponentVoiceSelection &&
        (secondaryVoiceIds && readyToStartRace ? (
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
              const usedIndexes: number[] = [];
              primaryVoiceIds.map((id) => {
                usedIndexes.push(voices.map((v) => v.id).indexOf(id));
              });
              const selectedVoices = [];
              for (let i = 0; i < noOfVoices; i++) {
                const randomIdx = createRandomNumber(
                  0,
                  voices.length - 1,
                  usedIndexes
                );
                selectedVoices.push(voices[randomIdx]);
                usedIndexes.push(randomIdx);
              }
              onChooseOpponent(selectedVoices);
              logFirebaseEvent("race_start", {
                track_id: selectedCoverDocId,
                primary_voice_id: primaryVoiceIds[0],
                random_secondary_voice_id: secondaryVoiceIds?.[0],
              });
              setReadyToStartRace(true);
            }}
            name={"Start Race"}
            width={290}
            height={93}
          />
        ))}
      {/* {!readyToStartRace && !showOpponentVoiceSelection && (
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
                primary_voice_id: primaryVoiceIds[0],
              });
              setShowOpponentVoiceSelection(true);
            }}
            name={"Choose Opponent"}
            width={290}
            height={93}
          />
        </Badge>
      )} */}
      {/* {showOpponentVoiceSelection && secondaryVoiceIds?.[0] && (
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
              if (!userDoc || !WebApp)
                return alert("Supported only on Telegram Mini App");
              if (!cost) return alert("This voice is not available yet");
              if (
                (userDoc?.purchasedVoices || []).includes(
                  `${selectedCoverDocId}_${secondaryVoiceIds?.[0]}`
                ) ||
                userDoc.isVip
              ) {
                logFirebaseEvent("race_start", {
                  track_id: selectedCoverDocId,
                  primary_voice_id: primaryVoiceIds[0],
                  secondary_voice_id: secondaryVoiceIds?.[0],
                  is_unlocked_race: true,
                });
                setShowOpponentVoiceSelection(false);
                setReadyToStartRace(true);
              } else if (
                secondaryVoiceIds?.[0] &&
                showOpponentVoiceSelection &&
                !readyToStartRace
              ) {
                try {
                  const orderId = await createOrder(
                    userDoc.id,
                    voices[
                      voices.map((v) => v.id).indexOf(secondaryVoiceIds?.[0])
                    ],
                    cost
                  );
                  const starsLink = await axios.post(
                    `${
                      import.meta.env.VITE_TG_BOT_SERVER
                    }/create-stars-invoice-link`,
                    {
                      // TODO: Support for multiple voices
                      title: `Unlock Race: ${primaryVoiceInfo[0].name} vs ${secondaryVoiceInfo?.[0].name}`,
                      description: `${primaryVoiceInfo[0].name} vs ${secondaryVoiceInfo?.[0].name}`,
                      prices: [
                        {
                          label: secondaryVoiceInfo?.[0].name,
                          amount: cost === 0.99 ? 50 : cost * 50,
                        },
                      ],
                      payload: { orderId, userId: userDoc.id },
                    }
                  );
                  WebApp.openInvoice(starsLink.data, async (status) => {
                    if (status === "paid") {
                      logFirebaseEvent("voice_purchase_success", {
                        track_id: selectedCoverDocId,
                        primary_voice_id: primaryVoiceInfo[0].id,
                        voice_id: secondaryVoiceIds?.[0],
                        amount: cost,
                        order_number: orderId,
                      });
                      await updatePurchasedVoice(
                        userDoc.id,
                        `${selectedCoverDocId}_${secondaryVoiceIds?.[0]}`
                      );
                      setShowOpponentVoiceSelection(false);
                      setReadyToStartRace(true);
                    } else if (status === "pending") {
                      // TODO: payment pending
                    } else {
                      alert("Payment Failed");
                    }
                  });
                  logFirebaseEvent("voice_purchase_attempt", {
                    track_id: selectedCoverDocId,
                    voice_id: secondaryVoiceIds?.[0],
                    amount: cost,
                    order_number: orderId,
                  });
                } catch (e) {
                  alert("Error Occured, try again later");
                }
              } else {
                setShowOpponentVoiceSelection(true);
              }
            }}
            name={
              readyToStartRace ||
              (userDoc?.purchasedVoices || []).includes(
                `${selectedCoverDocId}_${secondaryVoiceIds?.[0]}`
              ) ||
              userDoc?.isVip
                ? "Start Race"
                : "Unlock Race"
            }
            width={290}
            height={93}
          />
        </Box>
      )} */}
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
