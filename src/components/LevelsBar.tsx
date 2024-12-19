import { Box, Stack, Typography } from "@mui/material";

type Props = {
  currentLevel: number;
  selectedLevel: number;
  setSelectedLevel: (level: number) => void;
};

const size = 35;

const ArrowDown = () => {
  return (
    <Box
      sx={{
        width: 0,
        height: 0,
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderTop: "10px solid red",
        position: "absolute",
        top: -5,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    ></Box>
  );
};

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
        position={"relative"}
        onClick={() => {
          if (currentLevel >= 1) {
            setSelectedLevel(1);
          }
        }}
      >
        {selectedLevel === 1 && <ArrowDown />}
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
        position={"relative"}
        onClick={() => {
          if (currentLevel >= 2) {
            setSelectedLevel(2);
          }
        }}
      >
        {selectedLevel === 2 && <ArrowDown />}
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
        position={"relative"}
        onClick={() => {
          if (currentLevel >= 3) {
            setSelectedLevel(3);
          }
        }}
      >
        {selectedLevel === 3 && <ArrowDown />}
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
        position={"relative"}
        onClick={() => {
          if (currentLevel >= 4) {
            setSelectedLevel(4);
          }
        }}
      >
        {selectedLevel === 4 && <ArrowDown />}
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
        position={"relative"}
        onClick={() => {
          if (currentLevel >= 5) {
            setSelectedLevel(5);
          }
        }}
      >
        {selectedLevel === 5 && <ArrowDown />}
        <Typography>5</Typography>
      </Box>
    </Stack>
  );
};

export default LevelsBar;
