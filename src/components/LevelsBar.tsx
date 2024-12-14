import { Box, Stack, Typography } from "@mui/material";

type Props = {
  currentLevel: number;
  selectedLevel: number;
  setSelectedLevel: (level: number) => void;
};

const size = 35;

const LevelsBar = ({
  currentLevel,
  selectedLevel,
  setSelectedLevel,
}: Props) => {
  return (
    <Stack
      direction={"row"}
      gap={1}
      position={"relative"}
      alignItems={"center"}
      justifyContent={"center"}
      width={(size + 8) * 5}
    >
      <Box
        position={"absolute"}
        top={"50%"}
        left={"50%"}
        width={"95%"}
        p={0.5}
        bgcolor={"#ffd39f"}
        sx={{ transform: "translate(-50%, -50%)" }}
        zIndex={0}
      ></Box>
      <Box
        zIndex={1}
        width={size}
        height={size}
        bgcolor={currentLevel >= 1 ? "#ffb101" : "#ffd39f"}
        borderRadius={"50%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        border={selectedLevel === 1 ? "2px solid red" : "2px solid transparent"}
        onClick={() => {
          if (currentLevel >= 1) {
            setSelectedLevel(1);
          }
        }}
      >
        <Typography>1</Typography>
      </Box>
      <Box
        zIndex={1}
        width={size}
        height={size}
        bgcolor={currentLevel >= 2 ? "#ffb101" : "#ffd39f"}
        borderRadius={"50%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        border={selectedLevel === 2 ? "2px solid red" : "2px solid transparent"}
        onClick={() => {
          if (currentLevel >= 2) {
            setSelectedLevel(2);
          }
        }}
      >
        <Typography>2</Typography>
      </Box>
      <Box
        zIndex={1}
        width={size}
        height={size}
        bgcolor={currentLevel >= 3 ? "#ffb101" : "#ffd39f"}
        borderRadius={"50%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        border={selectedLevel === 3 ? "2px solid red" : "2px solid transparent"}
        onClick={() => {
          if (currentLevel >= 3) {
            setSelectedLevel(3);
          }
        }}
      >
        <Typography>3</Typography>
      </Box>
      <Box
        zIndex={1}
        width={size}
        height={size}
        bgcolor={currentLevel >= 4 ? "#ffb101" : "#ffd39f"}
        borderRadius={"50%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        border={selectedLevel === 4 ? "2px solid red" : "2px solid transparent"}
        onClick={() => {
          if (currentLevel >= 4) {
            setSelectedLevel(4);
          }
        }}
      >
        <Typography>4</Typography>
      </Box>
      <Box
        zIndex={1}
        width={size}
        height={size}
        bgcolor={currentLevel >= 5 ? "#ffb101" : "#ffd39f"}
        borderRadius={"50%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        border={selectedLevel === 5 ? "2px solid red" : "2px solid transparent"}
        onClick={() => {
          if (currentLevel >= 5) {
            setSelectedLevel(5);
          }
        }}
      >
        <Typography>5</Typography>
      </Box>
    </Stack>
  );
};

export default LevelsBar;
