import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { motion } from "framer-motion";
import { useState } from "react";
import TaskListDialog from "./TaskListDialog";
import { UserDoc } from "../services/db/user.service";
import LevelsBar from "./LevelsBar";

type Props = {
  showBackButton: boolean;
  showCoverTitle: boolean;
  showLevelsBar: boolean;
  onBackButtonClick?: () => void;
  coverTitle: string;
  userDoc: UserDoc | null;
  selectedLevel: number;
  setSelectedLevel: (level: number) => void;
  onTaskButtonClick: (task: string) => void;
};

const Header = ({
  selectedLevel,
  setSelectedLevel,
  showBackButton,
  showCoverTitle,
  showLevelsBar,
  onBackButtonClick,
  coverTitle,
  userDoc,
  onTaskButtonClick,
}: Props) => {
  const [showTaskListDialog, setShowTaskListDialog] = useState(false);

  return (
    <Stack width={"100%"}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems={"center"}
        width={"100%"}
      >
        <Box width={60} height={60}>
          {showBackButton && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: `url("/assets/tunedash/back.png") center center / contain no-repeat`,
                border: "none",
                cursor: "pointer",
                width: 60,
                height: 60,
              }}
              onClick={onBackButtonClick}
            />
          )}
        </Box>

        {showCoverTitle && (
          <Box
            position={"relative"}
            width={229}
            height={32}
            sx={{
              overflow: "hidden",
              height: "30px",
              background: `url("/assets/tunedash/player-topbar.png") center center / cover no-repeat`,
            }}
          >
            {/* <img src="/assets/tunedash/player-topbar.png" alt="logo" /> */}
            <Typography
              position="absolute"
              top={0}
              left={8}
              // width={"calc(100% - 24px)"}
              height={"100%"}
              display={"flex"}
              // justifyContent={"center"}
              alignItems={"center"}
              fontSize={"12px"}
              sx={{
                // scrolling text
                // textOverflow: "ellipsis",
                // overflow: "hidden",
                whiteSpace: "nowrap",
                fontSize: "10px",
                pl: 2,
              }}
              id="scroll-text"
            >
              {coverTitle}
            </Typography>
          </Box>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: `url("/assets/tunedash/hamburger-menu.png") center center / contain no-repeat`,
            border: "none",
            cursor: "pointer",
            width: 60,
            height: 60,
          }}
          onClick={() => {
            setShowTaskListDialog(true);
          }}
        />
        {/* <Chip
        sx={{ mx: 0.5, color: "white", fontSize: "12px", fontWeight: 900 }}
        label={inGameTokensCount}
      /> */}
        {userDoc && (
          <TaskListDialog
            userDoc={userDoc}
            open={showTaskListDialog}
            onTaskButtonClick={onTaskButtonClick}
            onClose={() => setShowTaskListDialog(false)}
          />
        )}
      </Stack>
      {showLevelsBar && (
        <Box display={"flex"} justifyContent={"center"}>
          <LevelsBar
            currentLevel={userDoc?.level || 1}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
          />
        </Box>
      )}
    </Stack>
  );
};

export default Header;
