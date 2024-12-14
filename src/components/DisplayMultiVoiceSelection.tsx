import { Box, Stack, Typography } from "@mui/material";
import { getVoiceAvatarPath } from "../helpers";
import { VoiceV1Cover } from "../services/db/coversV1.service";

type Props = {
  noOfVoices: number;
  primaryVoiceInfo: VoiceV1Cover[];
  currentIdx: number;
};

const sideOptionWidth = 55;
const sideOptionHeight = 55;

const DisplayMultiVoiceSelection = ({
  noOfVoices,
  primaryVoiceInfo,
  currentIdx,
}: Props) => {
  console.log(primaryVoiceInfo);
  return (
    <Stack
      direction={"row"}
      gap={2}
      justifyContent={"center"}
      width={"100%"}
      alignItems={"center"}
    >
      <Stack
        position={"relative"}
        justifyContent={"space-around"}
        alignItems={"center"}
        width={105}
        height={125}
      >
        {primaryVoiceInfo[currentIdx] ? (
          <img
            src={getVoiceAvatarPath(primaryVoiceInfo[currentIdx].id)}
            width={105}
            height={105}
            style={{
              borderRadius: "12px",
              cursor: "pointer",
            }}
          />
        ) : (
          <img
            src="/assets/tunedash/question-mark.png"
            width={"40%"}
            style={{
              objectFit: "contain",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          />
        )}
        <Box
          px={2}
          width={105}
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
            fontWeight={600}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {primaryVoiceInfo[currentIdx]?.name || "Random"}
          </Typography>
        </Box>
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
      </Stack>
      {noOfVoices > 1 && (
        <Stack
          gap={2}
          direction={"row"}
          flexWrap={"wrap"}
          alignItems={"center"}
          justifyContent={"center"}
          width={sideOptionWidth * 2.5}
        >
          {Array.from({ length: noOfVoices - 1 }).map((_, idx) => {
            const voiceInfo =
              primaryVoiceInfo[idx >= currentIdx ? idx + 1 : idx];
            return (
              <Stack
                key={idx}
                width={sideOptionWidth}
                height={sideOptionHeight}
                justifyContent={"space-between"}
                alignItems={"center"}
                position={"relative"}
              >
                <Box
                  width={"100%"}
                  height={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {voiceInfo ? (
                    <img
                      src={getVoiceAvatarPath(voiceInfo.id)}
                      width={sideOptionWidth}
                      height={sideOptionHeight}
                      style={{
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <img
                      src="/assets/tunedash/question-mark.png"
                      width={50}
                      height={50}
                      style={{
                        objectFit: "contain",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </Box>
              </Stack>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default DisplayMultiVoiceSelection;
