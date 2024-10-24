import { Badge, Box, Typography } from "@mui/material";
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
      p={4}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        width={"100%"}
        height={"85%"}
        py={2}
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
            <Badge
              badgeContent={
                <Box
                  sx={{
                    borderRadius: "50%",
                    width: 25,
                    height: 25,
                    backgroundColor: "#000",
                    // position: "absolute",
                    // top: 20,
                    // left: -20,
                  }}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography variant="caption" color={"#fff"}>
                    $
                    {idx > voices.length / 2
                      ? 15
                      : idx > voices.length / 3
                      ? 10
                      : 5}
                  </Typography>
                </Box>
              }
            >
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
            </Badge>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChooseVoice;
