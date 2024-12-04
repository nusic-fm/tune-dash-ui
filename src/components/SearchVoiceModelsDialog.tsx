import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import { DialogTransition } from "./TaskListDialog";
import { useCallback, useState } from "react";
import axios from "axios";
import { createVoiceRequest } from "../services/db/voiceRequests.service";
import { hasTimestampCrossedOneDay } from "../helpers";
import { UserDoc } from "../services/db/user.service";

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
    <Dialog
      open={showAddVoiceDialog}
      onClose={() => setShowAddVoiceDialog(false)}
      TransitionComponent={DialogTransition}
      keepMounted
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          height: 452,
          background: `url(/assets/tunedash/select-track-rect.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          //   backgroundRepeat: "no-repeat",
          // All child with background transparent
          "& > *": {
            background: "transparent",
          },
        },
      }}
    >
      <DialogTitle>Add a Voice</DialogTitle>
      {/* <Box
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Chip
          sx={{
            border: "1px solid #00FF48",
            background: "#0B9833 !",
            borderRadius: "8.5px",
            fontSize: 12,
          }}
          color="success"
          label="300 DASH"
          size="small"
        />
      </Box> */}

      <DialogContent>
        <Stack
          gap={2}
          alignItems={"center"}
          justifyContent={"space-between"}
          height={"100%"}
          py={2}
        >
          <Stack>
            <TextField
              label="Voice Name"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Stack
              py={2}
              gap={2}
              alignItems={"center"}
              sx={{ overflowY: "auto", height: 200 }}
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
                  <Typography align="center" variant="caption">
                    {voiceModel.title}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
          <LongImageMotionButton
            disabled={(hideSearchButton && !selectedVoiceModel) || isLoading}
            onClick={async () => {
              // TODO: check if can create voice request
              if (
                userDoc?.dailyVoiceRequestTimestamp &&
                hasTimestampCrossedOneDay(userDoc.dailyVoiceRequestTimestamp)
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
              } else {
                onSearch();
              }
            }}
            name={selectedVoiceModel ? "Submit" : "Search"}
            width={150}
            height={50}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SearchVoiceModelsDialog;
