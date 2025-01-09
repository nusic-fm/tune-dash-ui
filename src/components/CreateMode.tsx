import { Stack, Box, Typography, Avatar, Badge } from "@mui/material";
import { getVoiceAvatarPath, numberToDecimalsK } from "../helpers";
import { useState } from "react";
import SearchVoiceModelsDialog from "./SearchVoiceModelsDialog";
import { UserDoc } from "../services/db/user.service";
import { motion } from "framer-motion";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { query, collection, where } from "firebase/firestore";
import { db } from "../services/firebase.service";
import { VoiceRequest } from "../services/db/voiceRequests.service";

type Props = {
  selectedCoverId: string;
  coverTitle: string;
  userDoc: UserDoc | null;
};

// Five Different Light Colors for Background
export const FIVE_LIGHT_COLORS = [
  "#00E842",
  "#FF60FB",
  "#00E3EB",
  "#FFFFFF",
  "#F0B140",
];

const CreateMode = ({ coverTitle, userDoc, selectedCoverId }: Props) => {
  const [showAddVoiceDialog, setShowAddVoiceDialog] = useState(false);
  const [requestedVoicesSnapshot, ssLoading, ssError] = useCollectionDataOnce(
    query(
      collection(db, "tunedash_voice_requests"),
      where("coverId", "==", selectedCoverId)
    ),
    {
      getOptions: {
        source: "server",
      },
    }
  );

  return (
    <Stack
      gap={2}
      height={"100%"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
    >
      <img
        src={"/assets/tunedash/create-mode.png"}
        alt="create-mode"
        width={192}
        style={{ objectFit: "contain", backgroundRepeat: "no-repeat" }}
      />
      <Stack gap={1} alignItems={"center"} mt={2}>
        {requestedVoicesSnapshot?.filter((v) => !v.isCompleted).length && (
          <>
            <Typography color={"#fff"} fontSize={16}>
              Please Wait
            </Typography>
            <Typography sx={{ color: "#f2ad31", fontSize: 24 }}>
              {requestedVoicesSnapshot?.filter((v) => !v.isCompleted).length}
            </Typography>
            <Typography color={"#fff"} fontSize={16}>
              Voice Requests are Being Fulfilled
            </Typography>
          </>
        )}
        <Typography color={"#fff"} fontSize={16}>
          Click <span style={{ color: "#f2ad31", fontSize: 18 }}>+</span> To
          Place Bounty On Voice
        </Typography>
      </Stack>
      <Box
        width={window.innerWidth > 350 ? 350 : window.innerWidth}
        height={window.innerWidth > 350 ? 430 : 385}
        sx={{
          background: "url(/assets/tunedash/menu-voice-rect.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        position={"relative"}
        mb={2}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexWrap={"wrap"}
          height={"85%"}
          width={"100%"}
          py={1}
          borderRadius={10}
          sx={{
            overflowY: "auto",
          }}
          gap={2}
        >
          {new Array(12).fill("").map((_, idx) => {
            const requestedVoice = requestedVoicesSnapshot?.[
              idx
            ] as VoiceRequest;
            return (
              <Stack
                key={idx}
                width={"25%"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                {requestedVoice ? (
                  <>
                    <Box
                      width={65}
                      height={65}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {requestedVoice.isCompleted ? (
                        <img
                          src={getVoiceAvatarPath(requestedVoice.voiceId)}
                          width={60}
                          height={60}
                          style={{
                            borderRadius: "50%",
                            cursor: "pointer",
                            zIndex: 1,
                          }}
                        />
                      ) : (
                        <Badge
                          badgeContent={
                            <Box
                              // position={"absolute"}
                              // top={0}
                              // right={5}
                              bgcolor={"#f2ad31"}
                              borderRadius={1}
                              px={0.3}
                              // py={0.5}
                              zIndex={11}
                              display={"flex"}
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              <Typography
                                variant="caption"
                                color={"#000"}
                                fontSize={10}
                              >
                                {numberToDecimalsK(requestedVoice.bounty)}
                              </Typography>
                            </Box>
                          }
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <Avatar
                            sx={{
                              background: "#ffd39f",
                              color: "#000",
                              width: 45,
                              height: 45,
                            }}
                          >
                            {requestedVoice.voiceModelName[0]}
                          </Avatar>
                        </Badge>
                      )}
                    </Box>
                    <Typography
                      color={"#f0f0f0"}
                      fontSize={12}
                      fontWeight={900}
                      textAlign={"center"}
                      sx={{
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {requestedVoice.voiceModelName}
                    </Typography>
                  </>
                ) : (
                  <>
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAddVoiceDialog(true)}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: "8.5px",
                        background: "url(/assets/tunedash/add-voice.png)",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></motion.button>
                    <Typography
                      color={"#f0f0f0"}
                      fontSize={12}
                      fontWeight={900}
                      textAlign={"center"}
                      sx={{
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Add Voice
                    </Typography>
                  </>
                )}
              </Stack>
            );
          })}
        </Box>
      </Box>
      {userDoc && (
        <SearchVoiceModelsDialog
          showAddVoiceDialog={showAddVoiceDialog}
          onClose={(voiceInfo?: {
            name: string;
            modelId: string;
            bounty: number;
          }) => {
            setShowAddVoiceDialog(false);
          }}
          coverId={selectedCoverId}
          coverTitle={coverTitle}
          userDoc={userDoc}
        />
      )}
    </Stack>
  );
};

export default CreateMode;
