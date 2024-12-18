import { Stack, Typography, Box, Badge } from "@mui/material";
import { motion } from "framer-motion";
import { StoreItem } from "./TaskListDialog";

type Props = {
  onClick: () => void;
  disabled: boolean;
  storeItem: StoreItem;
  onBuyCoins: () => void;
};

const LIGHT_YELLOW_COLOR = "#f9c76f";
// const DARK_YELLOW_COLOR = "#f2ad31";

const StoreElement = ({ onClick, disabled, storeItem, onBuyCoins }: Props) => {
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
      px={2}
      py={1}
    >
      <Stack direction={"row"} gap={2} alignItems={"space-between"}>
        <Stack>
          <Typography variant="caption">{storeItem.title}</Typography>
        </Stack>
      </Stack>
      <Stack alignItems={"center"} gap={0.5}>
        <Box
          width={50}
          height={50}
          borderRadius={"50%"}
          border={"1px solid #fff"}
          sx={{
            bgcolor: LIGHT_YELLOW_COLOR,
            backgroundImage: `url(/assets/tunedash/tasks/${storeItem.icon})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        ></Box>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography
            variant="caption"
            sx={{
              textDecoration: "line-through",
              textDecorationColor: "red",
            }}
          >
            {storeItem.oldPrice}
          </Typography>
        </Stack>
      </Stack>
      <Badge
        badgeContent={storeItem.discount}
        color="success"
        sx={{
          ".MuiBadge-badge": {
            padding: "0px 2px",
            fontSize: "10px",
          },
        }}
      >
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.1 }}
          whileTap={{ scale: disabled ? 1 : 0.9 }}
          onClick={onBuyCoins}
          disabled={disabled}
          style={{
            width: 80,
            height: 30,
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
          <Typography variant="body2">{storeItem.buyButtonText}</Typography>
        </motion.button>
      </Badge>
    </Stack>
  );
};

export default StoreElement;
