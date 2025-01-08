import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { createCoverV1Doc } from "../services/db/coversV1.service";
import { updateUserObj, UserDoc } from "../services/db/user.service";
import { getYoutubeVideoId } from "../helpers";
import { arrayUnion, serverTimestamp } from "firebase/firestore";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import WebApp from "@twa-dev/sdk";

type Props = {
  userDoc: UserDoc;
  onAddCover: () => void;
};

const SearchYoutubeCover = ({ userDoc, onAddCover }: Props) => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={310}
      gap={1}
    >
      <TextField
        fullWidth
        placeholder="Url: youtube.com/watch?v=eOlo6xxCyiY"
        // label="voice name"
        size="small"
        // variant="filled"
        onChange={(e) => setYoutubeUrl(e.target.value)}
        sx={{
          background: "#F8CA76",
          borderRadius: 2,
          ".MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputBase-input": {
            fontSize: 12,
          },
        }}
      />
      <IconButton
        size="small"
        onClick={async () => {
          if (isLoading) return;
          const videoId = getYoutubeVideoId(youtubeUrl);
          if (!videoId) {
            alert("Invalid Youtube URL");
            return;
          }
          setIsLoading(true);
          const formData = new FormData();
          formData.append("vid", videoId);
          const res = await axios.post(
            `${import.meta.env.VITE_AUDIO_ANALYZER}/ytp-content`,
            formData
          );
          if (res.data) {
            const {
              title,
              channelDescription,
              channelId,
              channelThumbnail,
              channelTitle,
              videoDescription,
              videoThumbnail,
              duration,
            } = res.data;
            // await updateUserDocTimestamps(userDoc.id, "lastAddCoverTimestamp");
            const newCoverId = await createCoverV1Doc({
              title,
              voices: [],
              bpm: 0,
              duration,
              isReady: false,
              vocalsStartOffset: 0,
              vocalsEndOffset: duration,
              //   Other
              metadata: {
                videoThumbnail,
                videoName: title,
                videoDescription,
                channelId,
                channelTitle,
                channelDescription,
                channelThumbnail,
              },
              vid: videoId,
              shareInfo: {
                avatar: userDoc.photoUrl || "",
                id: userDoc.id,
                name:
                  userDoc.firstName ||
                  userDoc.lastName ||
                  userDoc.username ||
                  "User",
              },
              instrumentalUploaded: false,
              audioUploaded: false,
              beatsUploaded: false,
            });
            await updateUserObj(userDoc.id, {
              lastAddCoverTimestamp: serverTimestamp(),
              createdCoverIds: arrayUnion(newCoverId),
            });
            onAddCover();
            try {
              await axios.post(
                `${
                  import.meta.env.VITE_VOX_COVER_SERVER
                }/update-cover-pipeline`,
                {
                  coverId: newCoverId,
                }
              );
              WebApp.showAlert("Cover is being processed, check back later");
            } catch (e) {
              console.log(e);
            } finally {
              setIsLoading(false);
            }
          } else {
            alert("Unable to fetch Cover info");
          }
        }}
        sx={{
          background: "#FFB632",
          border: "2px solid #FFBE48",
          borderRadius: 2,
          padding: "2px",
        }}
      >
        {isLoading ? <CircularProgress size={16} /> : <AddRoundedIcon />}
      </IconButton>
    </Box>
  );
};

export default SearchYoutubeCover;
