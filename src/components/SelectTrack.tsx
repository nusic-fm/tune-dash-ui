import {
  Badge,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  CoverV1,
  CoverV1Doc,
  getPendingCoverFromUserId,
  VoiceV1Cover,
} from "../services/db/coversV1.service";
import { useEffect, useState } from "react";
import {
  downloadAudioFiles,
  marbleRaceOnlyInstrument,
  stopAndDestroyPlayers,
  // downloadAndPlayIntro,
} from "../hooks/useTonejs";
import { createRandomNumber } from "../helpers";
import LongImageMotionButton from "./Buttons/LongImageMotionButton";
import HeadsetRoundedIcon from "@mui/icons-material/HeadsetRounded";
// import { COVER_IDS } from "../App";
import SearchYoutubeCover from "./SearchYoutubeCover";
import { UserDoc } from "../services/db/user.service";

type Props = {
  coversSnapshot: QuerySnapshot<DocumentData>;
  onTrackSelected: (
    coverDoc: CoverV1,
    coverId: string,
    voiceId: VoiceV1Cover[] | null
  ) => void;
  selectedCoverDocId: string;
  onNextPageClick: () => void;
  userDoc: UserDoc | null;
};

const SelectTrack = ({
  coversSnapshot,
  onTrackSelected,
  onNextPageClick,
  selectedCoverDocId,
  userDoc,
}: Props) => {
  const [downloadingCoverId, setDownloadingCoverId] = useState<string>("");
  const [pendingCover, setPendingCover] = useState<CoverV1Doc | null>(null);

  const fetchPendingCover = async () => {
    if (userDoc) {
      const _pendingCover = await getPendingCoverFromUserId(userDoc.id);
      if (_pendingCover) {
        setPendingCover(_pendingCover);
      }
    }
  };
  useEffect(() => {
    if (userDoc) {
      fetchPendingCover();
    }
  }, [userDoc]);

  const downloadInstrumental = async (
    _coverId: string,
    _coverDoc: CoverV1,
    _voiceInfo: VoiceV1Cover
  ) => {
    setDownloadingCoverId(_coverId);
    stopAndDestroyPlayers();
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
        `https://voxaudio.nusic.fm/covers/${_coverId}/${_voiceInfo.id}.mp3`,
      ],
      (progress: number) => {
        console.log(progress);
      }
    );
    marbleRaceOnlyInstrument(
      _coverId,
      _coverDoc.bpm || 120,
      _coverDoc.vocalsStartOffset || 0,
      _coverDoc.vocalsEndOffset || _coverDoc.duration || 0
    );
    setDownloadingCoverId("");
  };

  return (
    <Stack
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={4}
      height={"100%"}
    >
      <img
        src={"/assets/tunedash/select-track.png"}
        alt="select-track"
        width={192}
        style={{ objectFit: "contain", backgroundRepeat: "no-repeat" }}
      />
      <Stack
        sx={{
          background: `url(/assets/tunedash/select-track-rect.png)`,
          width: window.innerWidth > 345 ? 345 : window.innerWidth,
          height: 452,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          overflowY: "auto",
        }}
        gap={2}
        alignItems={"center"}
        py={2}
        // px={1}
      >
        {coversSnapshot.docs
          // .sort((a, b) => {
          //   const aId = a.id;
          //   const bId = b.id;
          //   return COVER_IDS.indexOf(aId) - COVER_IDS.indexOf(bId);
          // })
          .map((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
            const coverDoc = doc.data() as CoverV1;
            return (
              <Box
                sx={{
                  background:
                    doc.id === "fEGU8n7EdEqhtMIfse09"
                      ? `url(/assets/tunedash/sr.png)`
                      : `url(/assets/tunedash/track-rect.png)`,
                  width: 312,
                  height: doc.id === "fEGU8n7EdEqhtMIfse09" ? 86 : 67,
                  backgroundRepeat: "no-repeat",
                }}
                flexShrink={0}
                key={doc.id}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={1}
                zIndex={9}
                onClick={async () => {
                  if (downloadingCoverId) return;
                  if (doc.id !== selectedCoverDocId) {
                    const randomIdx = createRandomNumber(
                      0,
                      coverDoc.voices.length - 1
                    );
                    const randomVoice = coverDoc.voices[randomIdx];
                    await downloadInstrumental(doc.id, coverDoc, randomVoice);
                    onTrackSelected(coverDoc, doc.id, [randomVoice]);
                  }
                }}
              >
                <Box
                  width={
                    selectedCoverDocId === doc.id ||
                    downloadingCoverId === doc.id
                      ? "75%"
                      : "70%"
                  }
                  sx={{ overflow: "hidden" }}
                >
                  <Typography
                    sx={{
                      // ellipsis
                      whiteSpace: "nowrap",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                    }}
                    alignSelf={"center"}
                    // width={"70%"}
                    fontSize={14}
                    id={selectedCoverDocId === doc.id ? "scroll-text" : ""}
                  >
                    {coverDoc.title}
                  </Typography>
                </Box>
                {downloadingCoverId === doc.id ? (
                  <CircularProgress
                    variant="indeterminate"
                    size={20}
                    sx={{ color: "#000" }}
                  />
                ) : selectedCoverDocId === doc.id ? (
                  <HeadsetRoundedIcon />
                ) : (
                  // <video
                  //   src="/assets/tunedash/playing.webm"
                  //   autoPlay
                  //   loop
                  //   width={62}
                  //   height={24}
                  //   style={{ borderRadius: "16px", objectFit: "cover" }}
                  // />
                  <Chip
                    label="Select"
                    size="small"
                    clickable={!downloadingCoverId}
                    sx={{ backgroundColor: "#000", color: "#FFA500" }}
                  />
                )}
              </Box>
            );
          })}
        {userDoc && !pendingCover && (
          <SearchYoutubeCover
            userDoc={userDoc}
            onAddCover={fetchPendingCover}
          />
        )}
        {pendingCover && (
          <Box
            sx={{
              background: `url(/assets/tunedash/track-rect.png)`,
              width: 312,
              height: 67,
              backgroundRepeat: "no-repeat",
            }}
            position={"relative"}
            flexShrink={0}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            zIndex={9}
            onClick={async () => {
              if (downloadingCoverId) return;
              if (pendingCover.id !== selectedCoverDocId) {
                // const randomIdx = createRandomNumber(
                //   0,
                //   coverDoc.voices.length - 1
                // );
                // const randomVoice = pendingCover.voices[0];
                // await downloadInstrumental(
                //   pendingCover.id,
                //   pendingCover,
                //   randomVoice
                // );
                //
                // await downloadAndPlayIntro(
                //   `https://voxaudio.nusic.fm/covers/${pendingCover.id}/audio.mp3?alt=media`,
                //   pendingCover.duration - 1,
                //   false
                // );
                onTrackSelected(pendingCover, pendingCover.id, []);
                onNextPageClick();
              }
            }}
          >
            <Box
              position={"absolute"}
              top={0}
              right={"50%"}
              sx={{ transform: "translate(50%, -50%)" }}
            >
              <Badge badgeContent="Pending" color="error"></Badge>
            </Box>
            <Box
              width={
                selectedCoverDocId === pendingCover.id ||
                downloadingCoverId === pendingCover.id
                  ? "75%"
                  : "70%"
              }
              sx={{ overflow: "hidden" }}
            >
              <Typography
                sx={{
                  // ellipsis
                  whiteSpace: "nowrap",
                  // overflow: "hidden",
                  // textOverflow: "ellipsis",
                }}
                alignSelf={"center"}
                // width={"70%"}
                fontSize={14}
                id={selectedCoverDocId === pendingCover.id ? "scroll-text" : ""}
              >
                {pendingCover.title}
              </Typography>
            </Box>
            {downloadingCoverId === pendingCover.id ? (
              <CircularProgress
                variant="indeterminate"
                size={20}
                sx={{ color: "#000" }}
              />
            ) : selectedCoverDocId === pendingCover.id ? (
              <HeadsetRoundedIcon />
            ) : (
              <Chip
                label={pendingCover.audioUploaded ? "Select" : "Pending"}
                size="small"
                clickable={!downloadingCoverId}
                sx={{ backgroundColor: "#000", color: "#FFA500" }}
                disabled={!pendingCover.audioUploaded}
              />
            )}
          </Box>
        )}
      </Stack>
      <LongImageMotionButton
        onClick={
          () => !downloadingCoverId && selectedCoverDocId && onNextPageClick()
          // onTrackSelected(
          //   selectedSnapshot.data() as CoverV1,
          //   selectedSnapshot.id,
          //   currentlyPlayingVoiceInfo || null
          // )
        }
        name={
          selectedCoverDocId === pendingCover?.id ? "Add Voice" : "Choose Voice"
        }
        width={230}
        height={75}
      />
    </Stack>
  );
};

export default SelectTrack;
