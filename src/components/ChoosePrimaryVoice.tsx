import {
  Stack,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Avatar,
  Badge,
} from "@mui/material";
import { CoverV1, VoiceV1Cover } from "../services/db/coversV1.service";
import {
  createRandomNumber,
  getVoiceAvatarPath,
  numberToDecimalsK,
} from "../helpers";
import { useEffect, useState } from "react";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import { switchVocalsByDownloading } from "../hooks/useTonejs";
import SearchVoiceModelsDialog from "./SearchVoiceModelsDialog";
import { UserDoc } from "../services/db/user.service";
import { motion } from "framer-motion";
import DisplayMultiVoiceSelection, {
  FOCUS_COLORS,
} from "./DisplayMultiVoiceSelection";

type Props = {
  onProceedToNextScreen: () => void;
  voices: VoiceV1Cover[];
  primaryVoiceInfo: VoiceV1Cover[];
  selectedCoverId: string;
  coverTitle: string;
  userDoc: UserDoc | null;
  noOfVoices: number;
  setPrimaryVoiceInfo: (voiceInfo: VoiceV1Cover[]) => void;
  coverDoc: CoverV1;
};

// Five Different Light Colors for Background
export const FIVE_LIGHT_COLORS = [
  "#00E842",
  "#FF60FB",
  "#00E3EB",
  "#FFFFFF",
  "#F0B140",
];

const ChoosePrimaryVoice = ({
  onProceedToNextScreen,
  voices,
  primaryVoiceInfo,
  selectedCoverId,
  coverTitle,
  userDoc,
  noOfVoices,
  setPrimaryVoiceInfo,
  coverDoc,
}: Props) => {
  const [selectedVoiceInfo, setSelectedVoiceInfo] = useState<
    VoiceV1Cover | undefined
  >(primaryVoiceInfo[0] || voices[0]);
  const [showAddVoiceDialog, setShowAddVoiceDialog] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [requestedVoices, setRequestedVoices] = useState<
    {
      name: string;
      modelId: string;
      bounty: number;
    }[]
  >(coverDoc?.requestedVoices || []);

  useEffect(() => {
    if (noOfVoices === 1) {
      setCurrentIdx(0);
    } else {
      const findNextEmptyIdx = (idx: number) => {
        if (primaryVoiceInfo[idx]) {
          if (idx === noOfVoices - 1) {
            return idx;
          }
          return findNextEmptyIdx(idx + 1);
        }
        return idx;
      };
      setCurrentIdx(findNextEmptyIdx(0));
    }
  }, [noOfVoices]);

  return (
    <Stack
      gap={2}
      height={"100%"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
    >
      {voices.length > 0 ? (
        <>
          <Typography
            variant="h6"
            sx={{
              textTransform: "capitalize",
              color: "#fff",
              textShadow: "0px 0px 10px #f2ad31",
            }}
          >
            Team {userDoc?.firstName || userDoc?.username}
          </Typography>
          <DisplayMultiVoiceSelection
            noOfVoices={noOfVoices}
            voicesInfo={primaryVoiceInfo}
            currentIdx={currentIdx}
          />
        </>
      ) : (
        <>
          <img
            src={"/assets/tunedash/create-mode.png"}
            alt="create-mode"
            width={192}
            style={{ objectFit: "contain", backgroundRepeat: "no-repeat" }}
          />
          <Stack gap={1} alignItems={"center"} mt={2}>
            <Typography color={"#fff"} fontSize={16}>
              This Song has{" "}
              <span style={{ color: "#f2ad31", fontSize: 20 }}>
                {coverDoc.requestedVoices?.length || 0}
              </span>{" "}
              Voices
            </Typography>
            <Typography color={"#fff"} fontSize={16}>
              Click <span style={{ color: "#f2ad31", fontSize: 20 }}>+</span> To
              Place Bounty On Voice
            </Typography>
          </Stack>
        </>
      )}
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
        {voices.length > 0 && (
          <Box
            position={"absolute"}
            bottom={0}
            left={0}
            sx={{ transform: "translateY(50%)" }}
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            zIndex={10}
          >
            <motion.button
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
            <Chip
              sx={{
                position: "absolute",
                bottom: 0,
                transform: "translateY(50%)",
                border: "1px solid #00FF48",
                background: "#0B9833",
                borderRadius: "8.5px",
                fontSize: 12,
              }}
              color="success"
              label="Add Voice"
              size="small"
            />
          </Box>
        )}
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
          {voices.length > 0
            ? voices.map((voice, idx) => (
                <Stack key={idx} width={"25%"} alignItems={"center"}>
                  <Box
                    onClick={async () => {
                      if (primaryVoiceInfo[currentIdx]?.id === voice.id) {
                        setCurrentIdx((prevIdx) => (prevIdx + 1) % noOfVoices);
                        return;
                      }
                      if (
                        primaryVoiceInfo.map((v) => v.id).includes(voice.id)
                      ) {
                        return;
                      }
                      setCurrentIdx((prevIdx) => (prevIdx + 1) % noOfVoices);
                      const newVoices = [...primaryVoiceInfo];
                      newVoices[currentIdx] = voice;
                      setPrimaryVoiceInfo(newVoices);
                      setSelectedVoiceInfo(voice);
                      setIsLoading(true);
                      await switchVocalsByDownloading(
                        selectedCoverId,
                        voice.id,
                        selectedVoiceInfo?.id || ""
                      );
                      setIsLoading(false);
                    }}
                    position={"relative"}
                    width={65}
                    height={65}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    borderRadius={"50%"}
                  >
                    {primaryVoiceInfo.map((v) => v.id).includes(voice.id) && (
                      <Box
                        position={"absolute"}
                        top={0}
                        left={0}
                        zIndex={10}
                        width={"100%"}
                        height={"100%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        borderRadius={"50%"}
                        sx={{
                          background: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {isLoading && voice.id === selectedVoiceInfo?.id ? (
                          <CircularProgress
                            sx={{ color: FIVE_LIGHT_COLORS[currentIdx - 1] }}
                            size={20}
                          />
                        ) : (
                          // <DoneRoundedIcon
                          //   sx={{ color: "#00e547" }}
                          //   fontSize="large"
                          // />
                          <Box
                            sx={{
                              width: 22,
                              height: 18,
                              background:
                                FIVE_LIGHT_COLORS[
                                  primaryVoiceInfo.findIndex(
                                    (v) => v.id === voice.id
                                  )
                                ],
                              borderRadius: 1,
                            }}
                            width={"100%"}
                            height={"100%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color={"#000"}
                              fontSize={12}
                            >
                              {primaryVoiceInfo.findIndex(
                                (v) => v.id === voice.id
                              ) + 1}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                    {primaryVoiceInfo.map((v) => v.id).includes(voice.id) && (
                      <img
                        src={`/assets/tunedash/focus_${
                          FOCUS_COLORS[
                            primaryVoiceInfo.findIndex((v) => v.id === voice.id)
                          ]
                        }.png`}
                        width={"100%"}
                        height={"100%"}
                        style={{
                          zIndex: 0,
                          cursor: "pointer",
                          // zoom: 1.1,
                          transform: "scale(1.2)",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    )}
                    <img
                      src={getVoiceAvatarPath(voice.id)}
                      width={60}
                      height={60}
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                        zIndex: 1,
                      }}
                    />
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
                    {voice.name}
                  </Typography>
                </Stack>
              ))
            : new Array(12).fill("").map((x, idx) => (
                <Stack
                  key={idx}
                  width={"25%"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  {requestedVoices[idx] ? (
                    <>
                      <Box
                        width={65}
                        height={65}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
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
                                {numberToDecimalsK(requestedVoices[idx].bounty)}
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
                            {requestedVoices[idx].name[0]}
                          </Avatar>
                        </Badge>
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
                        {requestedVoices[idx].name}
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
              ))}
        </Box>
      </Box>
      {coverDoc.isReady && (
        <Box pt={2} position={"sticky"} bottom={0} zIndex={10}>
          <LongImageMotionButton
            onClick={() => {
              if (primaryVoiceInfo.length < noOfVoices) {
                const newPrimaryVoiceInfo = [...primaryVoiceInfo];
                // Generate random voices
                const neededNoOfVoices = noOfVoices - primaryVoiceInfo.length;
                const usedIndexes = primaryVoiceInfo.map((voice) =>
                  voices.indexOf(voice)
                );
                for (let i = 0; i < neededNoOfVoices; i++) {
                  const randomIdx = createRandomNumber(
                    0,
                    voices.length - 1,
                    usedIndexes
                  );
                  const randomVoice = voices[randomIdx];
                  newPrimaryVoiceInfo.push(randomVoice);
                  usedIndexes.push(randomIdx);
                }
                setPrimaryVoiceInfo(newPrimaryVoiceInfo);
              }
              // const selectedVoices = [selectedVoiceInfo];
              // const currentIdx = voices.findIndex(
              //   (voice) => voice.id === selectedVoiceInfo.id
              // );
              // const usedIndexes = [currentIdx];
              // for (let i = 1; i < noOfVoices; i++) {
              //   let randomIdx = createRandomNumber(
              //     0,
              //     voices.length - 1,
              //     usedIndexes
              //   );
              //   const randomNextVoice = voices[randomIdx];
              //   selectedVoices.push(randomNextVoice);
              //   usedIndexes.push(randomIdx);
              // }
              onProceedToNextScreen();
            }}
            name="Proceed"
            width={230}
            height={70}
          />
        </Box>
      )}
      {/* <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: "url(/assets/tunedash/proceed.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: 250,
          height: 83,
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => {
          onPrimaryVoiceSelected(selectedVoiceInfo);
        }}
      /> */}
      {userDoc && (
        <SearchVoiceModelsDialog
          showAddVoiceDialog={showAddVoiceDialog}
          onClose={(voiceInfo?: {
            name: string;
            modelId: string;
            bounty: number;
          }) => {
            if (voiceInfo) {
              setRequestedVoices((prev) => [...prev, voiceInfo]);
            }
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

export default ChoosePrimaryVoice;
