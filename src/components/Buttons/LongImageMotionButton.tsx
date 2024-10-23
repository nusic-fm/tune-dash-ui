import { Typography } from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  onClick: () => void;
  name: string;
  width?: number;
  height?: number;
};

const LongImageMotionButton = ({ onClick, name, width, height }: Props) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        width: width || 250,
        height: height || 83,
        background: "url(/assets/tunedash/buttons/long.png)",
        backgroundSize: "cover",
        border: "none",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography fontSize={20}>{name}</Typography>
    </motion.button>
  );
};

export default LongImageMotionButton;
