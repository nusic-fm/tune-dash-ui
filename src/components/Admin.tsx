import { arrayUnion, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../services/firebase.service";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  addVoiceToCover,
  CoverV1,
  updateCoverV1Doc,
} from "../services/db/coversV1.service";
import {
  updateVoiceRequestDoc,
  VoiceRequest,
  VoiceRequestDoc,
} from "../services/db/voiceRequests.service";
import { useState } from "react";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { createVoiceModel } from "../services/db/voiceModels.service";
import { getVoiceAvatarPath, nameToSlug } from "../helpers";
import {
  checkIfPathExists,
  uploadVoiceAudio,
  uploadVoiceImage,
} from "../services/storage";
import { checkIfCoverIsReady } from "../services/db/metadata.service";

type Props = {};

const Admin = ({}: Props) => {
  const [coversSnapshot, coversLoading, coversError] = useCollection(
    query(collection(db, "tunedash_covers"), where("isReady", "==", false))
  );
  const [voiceRequestsSnapshot, voiceRequestsLoading, voiceRequestsError] =
    useCollection(
      query(
        collection(db, "tunedash_voice_requests"),
        where("isCompleted", "==", false)
      )
    );
  const [showVoiceRequestDoc, setShowVoiceRequestDoc] =
    useState<VoiceRequestDoc | null>(null);
  const [loadingAndErrors, setLoadingAndErrors] = useState<{
    [key: string]: {
      loading: boolean;
      error: string;
    };
  }>({});

  return (
    <Stack>
      <Typography variant="h4" align="center" my={2}>
        Admin Dashboard
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color={"yellow"}
        sx={{ background: "rgba(255,255,255,0.1)", p: 1 }}
      >
        Covers
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Metadata</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coversSnapshot?.docs.map((doc) => {
              const cover = doc.data() as CoverV1;
              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Typography
                      component="a"
                      href={`https://console.firebase.google.com/project/nusic-vox-player/firestore/databases/-default-/data/~2Ftunedash_covers~2F${doc.id}`}
                      target="_blank"
                    >
                      {cover.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography>
                        {cover.audioUploaded ? "✅" : "❌"} audio.mp3
                      </Typography>
                      <Typography>
                        {cover.instrumentalUploaded ? "✅" : "❌"}{" "}
                        instrumental.mp3
                      </Typography>
                      <Typography>
                        {cover.beatsUploaded ? "✅" : "❌"} beats info
                      </Typography>
                      <Typography>
                        {cover.voices.length >= 2 ? "✅" : "❌"} No of Voices:{" "}
                        {cover.voices.length}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      loading={loadingAndErrors[doc.id]?.loading}
                      onClick={async () => {
                        setLoadingAndErrors({
                          ...loadingAndErrors,
                          [doc.id]: { loading: true, error: "" },
                        });
                        try {
                          if (
                            !cover.audioUploaded ||
                            !cover.instrumentalUploaded
                          ) {
                            await axios.post(
                              `${
                                import.meta.env.VITE_VOX_COVER_SERVER
                              }/update-cover-pipeline`,
                              {
                                coverId: doc.id,
                              }
                            );
                          } else if (!cover.beatsUploaded) {
                            const formData = new FormData();
                            formData.append("cover_id", doc.id);
                            formData.append("title", cover.title);
                            await axios.post(
                              `${
                                import.meta.env.VITE_MARBLE_RACE_SERVER
                              }/upload-beats-info`,
                              formData
                            );
                          } else if (cover.voices.length < 2) {
                            //   setShowVoiceUploadId(doc.id);
                          } else {
                            const audioExists = await checkIfPathExists(
                              `covers/${doc.id}/audio.mp3`
                            );
                            const instrumentalExists = await checkIfPathExists(
                              `covers/${doc.id}/instrumental.mp3`
                            );
                            const beatsExists = await checkIfCoverIsReady(
                              doc.id
                            );
                            if (
                              audioExists &&
                              instrumentalExists &&
                              beatsExists
                            ) {
                              await updateCoverV1Doc(doc.id, { isReady: true });
                            }
                          }
                        } catch (error) {
                          setLoadingAndErrors({
                            ...loadingAndErrors,
                            [doc.id]: { loading: false, error: "error" },
                          });
                        } finally {
                          setLoadingAndErrors({
                            ...loadingAndErrors,
                            [doc.id]: { loading: false, error: "" },
                          });
                        }
                      }}
                    >
                      {!cover.audioUploaded || !cover.instrumentalUploaded
                        ? "Retry Pipeline"
                        : !cover.beatsUploaded
                        ? "Retry Beats"
                        : cover.voices.length < 2
                        ? "Upload Voices"
                        : "Mark as Ready"}
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography
        variant="h6"
        sx={{ background: "rgba(255,255,255,0.1)", p: 1 }}
        align="center"
        color={"yellow"}
      >
        Voice Requests
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cover Title</TableCell>
              <TableCell>Voice Model Name</TableCell>
              <TableCell>Bounty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voiceRequestsSnapshot?.docs.map((doc) => {
              const voiceRequest = doc.data() as VoiceRequest;
              return (
                <TableRow key={doc.id}>
                  <TableCell>{voiceRequest.coverTitle}</TableCell>
                  <TableCell>
                    <Typography
                      component="a"
                      href={`https://console.firebase.google.com/project/nusic-vox-player/firestore/databases/-default-/data/~2Ftunedash_voice_requests~2F${doc.id}`}
                      target="_blank"
                    >
                      {voiceRequest.voiceModelName}
                    </Typography>
                  </TableCell>
                  <TableCell>{voiceRequest.bounty}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setShowVoiceRequestDoc({
                          ...voiceRequest,
                          id: doc.id,
                        });
                      }}
                    >
                      Upload
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {!!showVoiceRequestDoc && (
        <AddVoiceDialog
          showVoiceRequestDoc={showVoiceRequestDoc}
          setShowVoiceRequestDoc={setShowVoiceRequestDoc}
        />
      )}
    </Stack>
  );
};

type voiceProps = {
  showVoiceRequestDoc: VoiceRequestDoc;
  setShowVoiceRequestDoc: (doc: VoiceRequestDoc | null) => void;
};

const AddVoiceDialog = ({
  showVoiceRequestDoc,
  setShowVoiceRequestDoc,
}: voiceProps) => {
  //   const [voiceModelOptions, setVoiceModelOptions] = useState<VoiceModel[]>([]);
  //   const [voiceModelOptionsLoading, setVoiceModelOptionsLoading] =
  //     useState(false);
  const [voiceModelName, setVoiceModelName] = useState<string>("");
  const [voiceModelImage, setVoiceModelImage] = useState<File | null>(null);
  const [voiceModelId, setVoiceModelId] = useState<string>("");
  const [voiceModelAudio, setVoiceModelAudio] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Dialog open onClose={() => setShowVoiceRequestDoc(null)}>
      <DialogTitle>Voice Info</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <TextField
              label="Voice Model Name"
              onChange={(e) => {
                setVoiceModelName(e.target.value);
                setVoiceModelId(nameToSlug(e.target.value));
              }}
              size="small"
            />
            <Typography variant="caption">{voiceModelId}</Typography>
            <img
              src={getVoiceAvatarPath(voiceModelId)}
              alt=""
              width={60}
              height={60}
            />
          </Box>
          {voiceModelImage ? (
            <img src={URL.createObjectURL(voiceModelImage)} alt="Voice Model" />
          ) : (
            <Stack>
              <Typography>Upload Avatar</Typography>
              <TextField
                //   label="Upload Avatar"
                type="file"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setVoiceModelImage(file);
                  }
                }}
              />
            </Stack>
          )}
          {voiceModelAudio ? (
            <audio src={URL.createObjectURL(voiceModelAudio)} controls />
          ) : (
            <Stack>
              <Typography>Upload Audio</Typography>
              <TextField
                //   label="Upload Audio"
                type="file"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setVoiceModelAudio(file);
                  }
                }}
              />
            </Stack>
          )}
          <LoadingButton
            variant="contained"
            color="primary"
            loading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              if (voiceModelName && voiceModelAudio) {
                if (voiceModelImage) {
                  await uploadVoiceImage(voiceModelId, voiceModelImage);
                }
                await uploadVoiceAudio(
                  showVoiceRequestDoc.coverId,
                  voiceModelId,
                  voiceModelAudio
                );
                await createVoiceModel(voiceModelId, voiceModelName);
                await updateVoiceRequestDoc(showVoiceRequestDoc.id, {
                  isCompleted: true,
                  voiceId: voiceModelId,
                });
                await addVoiceToCover(showVoiceRequestDoc.coverId, {
                  id: voiceModelId,
                  name: voiceModelName,
                });
                setShowVoiceRequestDoc(null);
              }
              setIsLoading(false);
            }}
          >
            Save
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Admin;

/* <Autocomplete
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            freeSolo
            noOptionsText="No voice models"
            options={voiceModelOptions}
            loading={voiceModelOptionsLoading}
            filterOptions={(options) => options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Voice Model Name"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {voiceModelOptionsLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                onChange={async (e) => {
                  setVoiceModelOptionsLoading(true);
                  const voiceModels = await getVoiceModelDocs(e.target.value);
                  setVoiceModelOptions(voiceModels);
                  setVoiceModelOptionsLoading(false);
                }}
              />
            )}
          /> */
