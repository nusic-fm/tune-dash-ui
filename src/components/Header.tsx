import { Box, Chip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { motion } from "framer-motion";

type Props = {
  showBackButton: boolean;
  showCoverTitle: boolean;
  onBackButtonClick?: () => void;
  coverTitle: string;
  xp: number;
};

const Header = ({
  showBackButton,
  showCoverTitle,
  onBackButtonClick,
  coverTitle,
  xp,
}: Props) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems={"center"}
      width={"100%"}
      py={2}
      position={"absolute"}
      top={0}
      left={0}
      zIndex={99}
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
            background: `url("/assets/tunedash/player-topbar.png") center center / contain no-repeat`,
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

      {/* <motion.button
        // whileHover={{ scale: 1.1 }}
        // whileTap={{ scale: 0.9 }}
        style={{
          background: `url("/assets/tunedash/hamburger-menu.png") center center / contain no-repeat`,
          border: "none",
          cursor: "pointer",
          width: 60,
          height: 60,
          opacity: 0,
        }}
        onClick={() => {}}
      /> */}
      <Chip
        sx={{ mx: 0.5, color: "white", fontSize: "12px", fontWeight: 900 }}
        label={xp + " XP"}
      />
    </Stack>
  );
};

export default Header;
