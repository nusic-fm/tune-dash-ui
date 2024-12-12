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
import { hasTimestampCrossedOneDay } from "../helpers";
import { UserDoc } from "../services/db/user.service";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  showAddVoiceDialog: boolean;
  setShowAddVoiceDialog: (show: boolean) => void;
  coverId: string;
  coverTitle: string;
  userDoc: UserDoc | null;
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
          height={150}
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
        >
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
            <Typography>Add a Voice</Typography>
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
        </Stack>
        {(voiceModels.length > 0 || noResult || isLoading) && (
          <Paper
            sx={{
              mt: -2.5,
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
                          ? "1px solid #000"
                          : "none",
                      borderRadius: 4,
                    }}
                    px={1}
                  >
                    <Typography align="center">{voiceModel.title}</Typography>
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
                    userDoc?.dailyVoiceRequestTimestamp &&
                    hasTimestampCrossedOneDay(
                      userDoc.dailyVoiceRequestTimestamp
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
                      userName: userDoc.username || "",
                      voiceModelName: selectedVoiceModel.title,
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