import { Stack, Box } from "@mui/material";
import SmallImageMotionButton from "./Buttons/SmallImageMotionButton";

type Props = {
  onStartClick: () => void;
};

const ScreenOne = ({ onStartClick }: Props) => {
  return (
    <Stack
      gap={4}
      height={"100%"}
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box mt={12}>
        <SmallImageMotionButton onClick={onStartClick} name="Start" />
      </Box>
    </Stack>
  );
};

export default ScreenOne;
