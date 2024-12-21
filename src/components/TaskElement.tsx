import { Stack, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { TaskItem } from "./TaskListDialog";

type Props = {
  onClick: () => void;
  disabled: boolean;
  task: TaskItem;
};

export const LIGHT_YELLOW_COLOR = "#f9c76f";
// const DARK_YELLOW_COLOR = "#f2ad31";

// const DailyOrOnceChip = ({ isDaily }: { isDaily: boolean }) => {
//   return (
//     <Box
//       sx={{ backgroundColor: LIGHT_YELLOW_COLOR, borderRadius: "3.5px" }}
//       height={22}
//       px={1}
//       display={"flex"}
//       alignItems={"center"}
//     >
//       <Typography
//         variant="caption"
//         color={"#855e2d"}
//         component={"span"}
//         fontSize={12}
//       >
//         {isDaily ? "Daily" : "Once"}
//       </Typography>
//     </Box>
//   );
// };

const TaskElement = ({ onClick, disabled, task }: Props) => {
  return (
    <Stack
      gap={1}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        bgcolor: "#eecc9e",
        borderRadius: 2,
        boxShadow: "0px 3.02px 7.249px 0px rgba(0, 0, 0, 0.25)",
        border: "2px solid #D79F72",
      }}
      px={3}
      py={1}
    >
      <Stack direction={"row"} gap={2} alignItems={"space-between"}>
        {/* <DailyOrOnceChip isDaily={isDaily} /> */}
        <Stack>
          <Typography variant="caption">{task.title}</Typography>
        </Stack>
        {/* <Box width={37}></Box> */}
      </Stack>
      <Stack alignItems={"center"} gap={0.5}>
        <Box
          width={50}
          height={50}
          borderRadius={"50%"}
          border={"1px solid #fff"}
          sx={{
            bgcolor: LIGHT_YELLOW_COLOR,
            backgroundImage: `url(/assets/tunedash/tasks/${task.icon})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></Box>
        <Stack direction={"row"} gap={2} alignItems={"center"}>
          <Typography variant="caption">+{task.rewardAmount} Dash</Typography>
        </Stack>
      </Stack>
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onClick={onClick}
        disabled={disabled}
        style={{
          width: 70,
          height: 24,
          borderRadius: "8.5px",
          boxShadow:
            "0px 1.968px 1.918px 1.476px rgba(255, 255, 255, 0.42) inset, 0px 0.984px 3.984px 1.968px rgba(47, 47, 47, 0.30)",
          background: "url(/assets/tunedash/tasks-modal/tiny-btn.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <Typography variant="caption">Go</Typography>
      </motion.button>
    </Stack>
  );
};

export default TaskElement;
