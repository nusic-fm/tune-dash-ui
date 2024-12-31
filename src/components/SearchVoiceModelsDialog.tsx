import {
  Stack,
  TextField,
  Typography,
  Modal,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import { useCallback, useState } from "react";
import axios from "axios";
import { createVoiceRequest } from "../services/db/voiceRequests.service";
import { hasTimestampCrossedOneDay, numberToDecimalsK } from "../helpers";
import { UserDoc } from "../services/db/user.service";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import WebApp from "@twa-dev/sdk";

type Props = {
  showAddVoiceDialog: boolean;
  setShowAddVoiceDialog: (show: boolean) => void;
  coverId: string;
  coverTitle: string;
  userDoc: UserDoc;
};

type WeightsModel = {
  title: string;
  creations: number;
  id: string;
  url: string;
  simplifiedTitle: string;
};

const SearchVoiceModelsDialog = ({
  showAddVoiceDialog,
  setShowAddVoiceDialog,
  coverId,
  coverTitle,
  userDoc,
}: Props) => {
  const [searchText, setSearchText] = useState("");
  const [hideSearchButton, setHideSearchButton] = useState(false);
  const [voiceModels, setVoiceModels] = useState<WeightsModel[]>([]);
  const [selectedVoiceModel, setSelectedVoiceModel] =
    useState<WeightsModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [bounty, setBounty] = useState(200);

  const onSearch = useCallback(async () => {
    if (searchText.length < 3) {
      setHideSearchButton(true);
      return;
    }
    try {
      setVoiceModels([]);
      setIsLoading(true);
      const result = await axios.post(
        `${import.meta.env.VITE_VOX_COVER_SERVER}/search-voice-models`,
        {
          title: searchText,
        }
      );
      console.log(result);
      if (result.data.length === 0) {
        setNoResult(true);
      } else {
        setSelectedVoiceModel(result.data[0]);
        setVoiceModels(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHideSearchButton(true);
      setIsLoading(false);
    }
  }, [searchText]);

  return (
    <Modal
      open={showAddVoiceDialog}
      onClose={() => setShowAddVoiceDialog(false)}
    >
      <Stack
        position={"absolute"}
        top={"50%"}
        left={"50%"}
        sx={{ transform: "translate(-50%, -50%)" }}
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
      >
        <Stack
          // height={150}
          width={"90%"}
          sx={{
            background: "#E3A32E",
            border: "2px solid #F2F102",
            borderRadius: "18px",
          }}
          alignItems={"center"}
          justifyContent={"center"}
          position={"relative"}
          gap={2}
          py={2}
        >
          <Stack>
            <Typography variant="caption">
              Want a new voice singing this song?
            </Typography>
            <Typography variant="caption">
              Place bounty on your request here!
            </Typography>
          </Stack>
          <Box
            position={"absolute"}
            top={-50}
            sx={{
              background: "#ECB375",
              border: "2px solid #FFD280",
              borderRadius: "10px",
            }}
            px={2}
          >
            <Typography>Add Voice</Typography>
          </Box>
          <Box
            // position={"absolute"}
            // top={10}
            sx={{
              background: "#FFB632",
              border: "2px solid #FFBE48",
              borderRadius: "10px",
            }}
            px={1}
          >
            <Typography variant="caption">Voice Name</Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            gap={1}
          >
            <TextField
              // label="voice name"
              size="small"
              // variant="filled"
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                background: "#F8CA76",
                borderRadius: 2,
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
            <IconButton
              size="small"
              onClick={onSearch}
              sx={{
                background: "#FFB632",
                border: "2px solid #FFBE48",
                borderRadius: 2,
                padding: "2px",
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <Box display={"flex"} alignItems={"center"} gap={0.5}>
              <img
                src="/assets/tunedash/double-coin.png"
                width={30}
                height={30}
                style={{ objectFit: "cover" }}
              />
              <Typography>eDash</Typography>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              bgcolor={"#F8CA76"}
              borderRadius={2}
              px={1}
            >
              <Typography>{numberToDecimalsK(bounty)}</Typography>
              <IconButton
                size="small"
                onClick={() => {
                  const newBounty = bounty + 200;
                  if (newBounty > userDoc?.coins) {
                    return WebApp.showAlert("You don't have enough eDash");
                  }
                  setBounty(newBounty);
                }}
              >
                <AddCircleRoundedIcon />
              </IconButton>
              <IconButton
                size="small"
                disabled={bounty <= 200}
                onClick={() => {
                  const newBounty = bounty - 200;
                  if (newBounty < 0) {
                    return WebApp.showAlert("Bounty cannot be negative");
                  }
                  setBounty(newBounty);
                }}
              >
                <RemoveCircleRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </Stack>
        {(voiceModels.length > 0 || noResult || isLoading) && (
          <Paper
            sx={{
              mt: -1.5,
              // background: "#E3A32E",
              background:
                "linear-gradient(181deg, rgba(255, 182, 50, 0.63) 31.04%, rgba(253, 171, 23, 0.63) 55.47%, rgba(240, 190, 99, 0.63) 83.03%)",
              backdropFilter: "blur(5px)",
              border: "3px solid #FFB632",
              borderRadius: "13px",
              width: "85%",
            }}
          >
            <Stack gap={2} alignItems={"center"}>
              <Stack
                sx={{ overflowY: "auto", maxHeight: "400px", px: 1 }}
                alignItems={"center"}
                gap={2}
                py={2}
              >
                {isLoading && (
                  <Typography variant="caption">Loading...</Typography>
                )}
                {noResult && (
                  <Typography variant="caption" color={"red"}>
                    No results found
                  </Typography>
                )}
                {voiceModels.map((voiceModel) => (
                  <Stack
                    direction={"row"}
                    justifyContent={"center"}
                    onClick={() => {
                      if (selectedVoiceModel?.title === voiceModel.title) {
                        setSelectedVoiceModel(null);
                      } else {
                        setSelectedVoiceModel(voiceModel);
                      }
                    }}
                    width={"100%"}
                    sx={{
                      outline:
                        selectedVoiceModel?.title === voiceModel.title
                          ? "2px solid #FFBE48"
                          : "",
                      background:
                        selectedVoiceModel?.title === voiceModel.title
                          ? "#F8CA76"
                          : "transparent",
                      borderRadius: 1,
                    }}
                    px={1}
                    position={"relative"}
                  >
                    <Typography
                      align="center"
                      variant="caption"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {voiceModel.title}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <LongImageMotionButton
                disabled={
                  (hideSearchButton && !selectedVoiceModel) || isLoading
                }
                onClick={async () => {
                  // TODO: check if user can create voice request
                  if (
                    !hasTimestampCrossedOneDay(
                      userDoc?.dailyVoiceRequestTimestamp
                    )
                  ) {
                    return alert("You have already requested a voice today");
                  }
                  if (selectedVoiceModel && userDoc) {
                    await createVoiceRequest({
                      coverId,
                      coverTitle,
                      modelId: selectedVoiceModel.id,
                      userId: userDoc.id,
                      name:
                        userDoc.username ||
                        userDoc.firstName ||
                        userDoc.lastName ||
                        "",
                      voiceModelName: selectedVoiceModel.title,
                      bounty,
                    });
                    alert("Voice request created successfully");
                    setShowAddVoiceDialog(false);
                  }
                }}
                name={"Submit"}
                width={150}
                height={50}
              />
            </Stack>
          </Paper>
        )}
      </Stack>
    </Modal>
  );
};

export default SearchVoiceModelsDialog;
