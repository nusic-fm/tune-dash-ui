import { Box } from "@mui/material";
import { Stack } from "@mui/system";
import { motion } from "framer-motion";

type Props = { showBackButton?: boolean; onBackButtonClick?: () => void };

const Header = ({ showBackButton = false, onBackButtonClick }: Props) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems={"center"}
      width={"100%"}
      py={2}
    >
      <Box>
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
        onClick={() => {}}
      />
    </Stack>
  );
};

export default Header;
