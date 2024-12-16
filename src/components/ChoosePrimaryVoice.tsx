import { Stack, Box, Typography, Chip, Slider } from "@mui/material";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import { createRandomNumber, getVoiceAvatarPath } from "../helpers";
import { useState } from "react";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import { switchVocalsByDownloading } from "../hooks/useTonejs";
import SearchVoiceModelsDialog from "./SearchVoiceModelsDialog";
import { UserDoc } from "../services/db/user.service";
import { motion } from "framer-motion";
import DisplayMultiVoiceSelection from "./DisplayMultiVoiceSelection";

type Props = {
  onProceedToNextScreen: () => void;
  voices: VoiceV1Cover[];
  primaryVoiceInfo: VoiceV1Cover[];
  selectedCoverId: string;
  coverTitle: string;
  userDoc: UserDoc | null;
  noOfVoices: number;
  setPrimaryVoiceInfo: (voiceInfo: VoiceV1Cover[]) => void;
};

const ChoosePrimaryVoice = ({
  onProceedToNextScreen,
  voices,
  primaryVoiceInfo,
  selectedCoverId,
  coverTitle,
  userDoc,
  noOfVoices,
  setPrimaryVoiceInfo,
}: Props) => {
  const [selectedVoiceInfo, setSelectedVoiceInfo] = useState<VoiceV1Cover>(
    primaryVoiceInfo[0] || voices[0]
  );
  const [showAddVoiceDialog, setShowAddVoiceDialog] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  return (
    <Stack
      gap={2}
      height={"100%"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
    >
      <DisplayMultiVoiceSelection
        noOfVoices={noOfVoices}
        primaryVoiceInfo={primaryVoiceInfo}
        currentIdx={currentIdx}
      />
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
          <Box></Box>
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
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexWrap={"wrap"}
          height={"85%"}
          width={"100%"}
          // my={2}
          borderRadius={10}
          sx={{
            overflowY: "auto",
          }}
          gap={3}
        >
          {voices.map((voice, idx) => (
            <Stack key={idx}>
              <Box
                onClick={() => {
                  setCurrentIdx((prevIdx) => (prevIdx + 1) % noOfVoices);
                  const newVoices = [...primaryVoiceInfo];
                  newVoices[currentIdx] = voice;
                  setPrimaryVoiceInfo(newVoices);
                  setSelectedVoiceInfo(voice);
                  switchVocalsByDownloading(
                    selectedCoverId,
                    voice.id,
                    selectedVoiceInfo.id
                  );
                }}
                position={"relative"}
                width={65}
                height={65}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderRadius={"50%"}
                border={"4px solid #AABBCC"}
              >
                {voice.id === selectedVoiceInfo.id && (
                  <img
                    src={"/assets/tunedash/focus.png"}
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
              >
                {voice.name.slice(0, 10)}
                {voice.name.length > 10 ? "..." : ""}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Box>
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
          height={75}
        />
      </Box>
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
      <SearchVoiceModelsDialog
        showAddVoiceDialog={showAddVoiceDialog}
        setShowAddVoiceDialog={setShowAddVoiceDialog}
        coverId={selectedCoverId}
        coverTitle={coverTitle}
        userDoc={userDoc}
      />
    </Stack>
  );
};

export default ChoosePrimaryVoice;
