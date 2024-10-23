import { Box } from "@mui/material";
import { getVoiceAvatarPath } from "../helpers";
import { VoiceV1Cover } from "../services/db/coversV1.service";

type Props = {
  voices: VoiceV1Cover[];
  selectedVoiceId: string;
  setSelectedVoiceId: (voiceInfo: VoiceV1Cover) => void;
};

const ChooseVoice = ({
  voices,
  selectedVoiceId,
  setSelectedVoiceId,
}: Props) => {
  return (
    <Box
      width={320}
      height={400}
      sx={{
        background: "url(/assets/tunedash/menu-voice-rect.png)",
        backgroundSize: "cover",
      }}
      py={4}
      px={4}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        width={"100%"}
        height={"100%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          // background: "rgba(0,0,0,0.6)",
        }}
        gap={1}
      >
        {voices.map((voice, idx) => (
          <Box
            key={idx}
            onClick={() => setSelectedVoiceId(voice)}
            position={"relative"}
            width={65}
            height={65}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {voice.id === selectedVoiceId && (
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
  );
};

export default ChooseVoice;
