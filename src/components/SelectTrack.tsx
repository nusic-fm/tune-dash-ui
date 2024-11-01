import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import {
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { CoverV1, VoiceV1Cover } from "../services/db/coversV1.service";
import { useEffect, useState } from "react";
import {
  downloadAudioFiles,
  marbleRaceOnlyInstrument,
  stopAndDestroyPlayers,
} from "../hooks/useTonejs";
import { createRandomNumber } from "../helpers";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";

type Props = {
  coversSnapshot: QuerySnapshot<DocumentData>;
  onTrackSelected: (
    coverDoc: CoverV1,
    coverId: string,
    voiceId: VoiceV1Cover | null
  ) => void;
  selectedCoverDocId: string;
};

const SelectTrack = ({
  coversSnapshot,
  onTrackSelected,
  selectedCoverDocId,
}: Props) => {
  const [selectedSnapshot, setSelectedSnapshot] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData>>();
  const [downloading, setDownloading] = useState(false);
  const [currentlyPlayingVoiceInfo, setCurrentlyPlayingVoiceInfo] =
    useState<VoiceV1Cover>();

  const downloadInstrumental = async (_coverId: string, _coverDoc: CoverV1) => {
    setDownloading(true);
    stopAndDestroyPlayers();
    const randomVoice =
      _coverDoc.voices[createRandomNumber(0, _coverDoc.voices.length - 1)];
    setCurrentlyPlayingVoiceInfo(randomVoice);
    await downloadAudioFiles(
      [
        `https://voxaudio.nusic.fm/covers/${_coverId}/instrumental.mp3`,
        // ...(_coverDoc ? _coverDoc.voices.slice(0, 5) : selectedVoices)
        //   .map((v) => v.id)
        //   .map(
        //     (v) =>
        //       `https://voxaudio.nusic.fm/covers/${
        //         _coverId || selectedCoverDocId
        //       }/${v}.mp3`
        //   ),
        `https://voxaudio.nusic.fm/covers/${_coverId}/${randomVoice.id}.mp3`,
      ],
      (progress: number) => {
        console.log(progress);
      }
    );
    marbleRaceOnlyInstrument(_coverId, 120, 0);
    setDownloading(false);
  };

  useEffect(() => {
    if (selectedCoverDocId) {
      setSelectedSnapshot(
        coversSnapshot.docs.find((doc) => doc.id === selectedCoverDocId)
      );
    }
  }, [selectedCoverDocId]);

  return (
    <Stack width={"100%"} alignItems={"center"} gap={4} height={"100%"}>
      <img
        src={"/assets/tunedash/select-track.png"}
        alt="select-track"
        width={192}
        style={{ objectFit: "contain", backgroundRepeat: "no-repeat" }}
      />
      <Stack
        sx={{
          background: `url(/assets/tunedash/select-track-rect.png)`,
          width: 345,
          height: 452,
          backgroundRepeat: "no-repeat",
        }}
        gap={2}
        alignItems={"center"}
        py={2}
        px={1}
      >
        {coversSnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
            const coverDoc = doc.data() as CoverV1;
            return (
              <Box
                sx={{
                  background: `url(/assets/tunedash/track-rect.png)`,
                  width: 312,
                  height: 67,
                  backgroundRepeat: "no-repeat",
                }}
                key={doc.id}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={1}
                zIndex={9}
                onClick={() => {
                  if (doc.id !== selectedSnapshot?.id) {
                    setSelectedSnapshot(doc);
                    downloadInstrumental(doc.id, coverDoc);
                  }
                }}
              >
                <Typography
                  sx={{
                    // ellipsis
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  alignSelf={"center"}
                  width={"70%"}
                  fontSize={14}
                >
                  {coverDoc.title}
                </Typography>
                {selectedSnapshot?.id === doc.id ? (
                  !downloading && (
                    <video
                      src="/assets/tunedash/playing.webm"
                      autoPlay
                      loop
                      width={62}
                      height={24}
                      style={{ borderRadius: "16px", objectFit: "cover" }}
                    />
                  )
                ) : (
                  <Chip
                    label="Select"
                    size="small"
                    clickable
                    sx={{ backgroundColor: "#000", color: "#FFA500" }}
                  />
                )}
                {downloading && selectedSnapshot?.id === doc.id && (
                  <CircularProgress
                    variant="indeterminate"
                    size={20}
                    sx={{ color: "#000" }}
                  />
                )}
              </Box>
            );
          }
        )}
      </Stack>
      <LongImageMotionButton
        onClick={() =>
          selectedSnapshot &&
          onTrackSelected(
            selectedSnapshot.data() as CoverV1,
            selectedSnapshot.id,
            currentlyPlayingVoiceInfo || null
          )
        }
        name="Proceed"
        width={230}
        height={75}
      />
    </Stack>
  );
};

export default SelectTrack;
