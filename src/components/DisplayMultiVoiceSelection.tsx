import { Box, Stack, Typography } from "@mui/material";
import { getVoiceAvatarPath } from "../helpers";
import { VoiceV1Cover } from "../services/db/coversV1.service";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FIVE_LIGHT_COLORS } from "./ChoosePrimaryVoice";

type Props = {
  noOfVoices: number;
  primaryVoiceInfo: VoiceV1Cover[];
  currentIdx: number;
};

const sideOptionWidth = 55;
const sideOptionHeight = 55;
export const FOCUS_COLORS = ["green", "pink", "skyblue", "white", "yellow"];
const DisplayMultiVoiceSelection = ({
  noOfVoices,
  primaryVoiceInfo,
  currentIdx,
}: Props) => {
  return (
    <Stack
      direction={"row"}
      gap={2}
      justifyContent={"center"}
      width={"100%"}
      alignItems={"center"}
    >
      <Stack gap={1}>
        {[3, 5].map((idx) => {
          const voiceInfo = primaryVoiceInfo[idx - 1];
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
                position={"relative"}
              >
                {noOfVoices < idx && (
                  <Box
                    position={"absolute"}
                    top={0}
                    left={0}
                    width={"100%"}
                    height={"100%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      background: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "12px",
                    }}
                  >
                    <LockOutlinedIcon color="warning" />
                  </Box>
                )}
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
                {currentIdx === idx - 1 && (
                  <img
                    src={`/assets/tunedash/focus_${FOCUS_COLORS[idx - 1]}.png`}
                    width={"100%"}
                    height={"100%"}
                    style={{
                      zIndex: 0,
                      cursor: "pointer",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: "scale(1.2)",
                    }}
                  />
                )}
                {currentIdx === idx - 1 && (
                  <Box
                    position={"absolute"}
                    top={-10}
                    left={"50%"}
                    sx={{
                      transform: "translate(-50%, -50%)",
                      width: 22,
                      height: 18,
                      background: FIVE_LIGHT_COLORS[idx - 1],
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
                      {idx}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          );
        })}
      </Stack>
      <Stack
        position={"relative"}
        justifyContent={"space-around"}
        alignItems={"center"}
        width={105}
        height={125}
      >
        {currentIdx === 0 && (
          <Box
            position={"absolute"}
            top={-10}
            left={"50%"}
            sx={{
              transform: "translate(-50%, -50%)",
              width: 22,
              height: 18,
              background: FIVE_LIGHT_COLORS[0],
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
              1
            </Typography>
          </Box>
        )}
        {primaryVoiceInfo[0] ? (
          <img
            src={getVoiceAvatarPath(primaryVoiceInfo[0].id)}
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
          px={1}
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
            {primaryVoiceInfo[0]?.name}
          </Typography>
        </Box>
        {currentIdx === 0 && (
          <img
            src={`/assets/tunedash/focus_${FOCUS_COLORS[0]}.png`}
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
      </Stack>
      <Stack gap={1}>
        {[2, 4].map((idx) => {
          const voiceInfo = primaryVoiceInfo[idx - 1];
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
                position={"relative"}
              >
                {noOfVoices < idx && (
                  <Box
                    position={"absolute"}
                    top={0}
                    left={0}
                    width={"100%"}
                    height={"100%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      background: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "12px",
                    }}
                  >
                    <LockOutlinedIcon color="warning" />
                  </Box>
                )}
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
                {currentIdx === idx - 1 && (
                  <img
                    src={`/assets/tunedash/focus_${FOCUS_COLORS[idx - 1]}.png`}
                    width={"100%"}
                    height={"100%"}
                    style={{
                      zIndex: 0,
                      cursor: "pointer",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: "scale(1.2)",
                    }}
                  />
                )}
                {currentIdx === idx - 1 && (
                  <Box
                    position={"absolute"}
                    top={-10}
                    left={"50%"}
                    sx={{
                      transform: "translate(-50%, -50%)",
                      width: 22,
                      height: 18,
                      background: FIVE_LIGHT_COLORS[idx - 1],
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
                      {idx}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          );
        })}
      </Stack>
      {/* {noOfVoices > 1 && (
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
      )} */}
    </Stack>
  );
};

export default DisplayMultiVoiceSelection;
