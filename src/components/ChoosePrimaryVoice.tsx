import { Stack, Box, Typography } from "@mui/material";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import { getVoiceAvatarPath } from "../helpers";
import { useState } from "react";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";

type Props = {
  onPrimaryVoiceSelected: (voiceInfo: VoiceV1Cover) => void;
  voices: VoiceV1Cover[];
};

const ChoosePrimaryVoice = ({ onPrimaryVoiceSelected, voices }: Props) => {
  const [selectedVoiceInfo, setSelectedVoiceInfo] = useState<VoiceV1Cover>(
    voices[0]
  );
  return (
    <Stack
      gap={4}
      height={"calc(100% - 95px)"}
      width={"100%"}
      display={"flex"}
      justifyContent={"start"}
      alignItems={"center"}
    >
      <Box
        width={172}
        height={180}
        // sx={{
        //   background: `url(/assets/tunedash/voice-card.png)`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
        position={"relative"}
        display={"flex"}
        justifyContent={"center"}
      >
        <img
          src={getVoiceAvatarPath(selectedVoiceInfo.id)}
          width={"60%"}
          style={{
            borderRadius: "12px",
            cursor: "pointer",
            top: "45%",
            transform: "translateY(-50%)",
            position: "absolute",
          }}
        />
        <Box
          position={"absolute"}
          top="83%"
          width={100}
          height={20}
          sx={{
            background: `url(/assets/tunedash/track-rect.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            variant="caption"
            color={"#000"}
            fontWeight={600}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedVoiceInfo.name}
          </Typography>
        </Box>
      </Box>
      <Box
        width={350}
        height={430}
        sx={{
          background: "url(/assets/tunedash/menu-voice-rect.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        display={"flex"}
        justifyContent={"center"}
        p={2}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexWrap={"wrap"}
          height={"85%"}
          width={"100%"}
          py={2}
          sx={{
            overflowY: "auto",
          }}
        >
          {voices.map((voice, idx) => (
            <Box
              key={idx}
              onClick={() => setSelectedVoiceInfo(voice)}
              position={"relative"}
              width={65}
              height={65}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
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
                    transform: "scale(1.1)",
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
          ))}
        </Box>
      </Box>
      <LongImageMotionButton
        onClick={() => {
          onPrimaryVoiceSelected(selectedVoiceInfo);
        }}
        name="Proceed"
        width={230}
        height={75}
      />
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
    </Stack>
  );
};

export default ChoosePrimaryVoice;
