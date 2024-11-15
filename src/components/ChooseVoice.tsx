import { Badge, Box, Stack, Typography } from "@mui/material";
import { getVoiceAvatarPath } from "../helpers";
import { VoiceV1Cover } from "../services/db/coversV1.service";

type Props = {
  voices: VoiceV1Cover[];
  selectedVoiceId: string;
  onChooseOpponent: (voiceInfo: VoiceV1Cover, cost: number) => void;
  filterOutVoiceIds: string[];
};

const ChooseVoice = ({
  voices,
  selectedVoiceId,
  onChooseOpponent,
  filterOutVoiceIds,
}: Props) => {
  return (
    <Box
      width={320}
      height={400}
      sx={{
        background: "url(/assets/tunedash/menu-voice-rect.png)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        width={"94%"}
        height={"80%"}
        py={2}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          // background: "rgba(0,0,0,0.6)",
        }}
        gap={3}
      >
        {voices
          .filter((v) => !filterOutVoiceIds.includes(v.id))
          .map((voice, idx) => {
            const cost =
              idx > voices.length / 2 ? 5 : idx > voices.length / 3 ? 2 : 0.99;
            return (
              <Stack key={idx}>
                <Box
                  onClick={() => onChooseOpponent(voice, cost)}
                  position={"relative"}
                  width={65}
                  height={65}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRadius={"50%"}
                  border={"4px solid #AABBCC"}
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
                        transform: "scale(1.3)",
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
                          width: 30,
                          height: 30,
                          backgroundColor: "#000",
                          backgroundImage: "url(/assets/tunedash/bubble.png)",
                          backgroundSize: "contain",
                          // position: "absolute",
                          // top: 20,
                          // left: -20,
                        }}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Typography
                          variant="caption"
                          color={"#000"}
                          fontSize={8}
                          fontWeight={900}
                        >
                          ${cost}
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
            );
          })}
      </Box>
    </Box>
  );
};

export default ChooseVoice;
