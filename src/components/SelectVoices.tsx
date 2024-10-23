import {
    Stack,
    Typography,
    Box,
    Avatar,
    Tooltip,
    Popover,
    // useMediaQuery,
    // useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { GameVoiceInfo } from "../game/scenes/Preloader";
import { useEffect, useState } from "react";
import { VoiceV1Cover } from "../services/db/coversV1.service";

type Props = {
    selectedVoices: GameVoiceInfo[];
    voices: VoiceV1Cover[];
    setSelectedVoices: any;
};

const SelectVoices = ({ selectedVoices, setSelectedVoices, voices }: Props) => {
    const [dialogRef, setDialogRef] = useState<{
        ref: any;
        vid: string;
    } | null>(null);
    const [voiceSlotObj, setVoiceSlotObj] = useState<{
        [key: string]: GameVoiceInfo | null;
    }>({});
    // const theme = useTheme();
    // const isMobileView = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (voices.length) {
            const _obj: { [key: string]: GameVoiceInfo | null } = {};
            selectedVoices.map((v, i) => {
                _obj[i] = v;
            });
            setVoiceSlotObj(_obj);
        }
    }, [voices]);

    return (
        <Stack direction="row" gap={3} width="100%" sx={{ overflowX: "auto" }}>
            {new Array(voices.length > 5 ? 5 : voices.length)
                .fill("")
                .map((_, i) => (
                    <Stack key={i} gap={1} alignItems="center">
                        <Typography>Voice {i + 1}</Typography>
                        <Tooltip title={voiceSlotObj[i]?.name}>
                            <Box position={"relative"} width={80} height={80}>
                                <Avatar
                                    src={voiceSlotObj[i]?.avatar}
                                    sx={{
                                        width: 76,
                                        height: 76,
                                        border: "2px solid #fff",
                                    }}
                                />
                                <Box
                                    position={"absolute"}
                                    top={0}
                                    right={0}
                                    display="flex"
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    width="100%"
                                    height={"100%"}
                                    sx={{
                                        ":hover": {
                                            background: "rgba(0,0,0,0.4)",
                                        },
                                    }}
                                >
                                    <AddIcon
                                        fontSize="large"
                                        color="secondary"
                                        sx={{ cursor: "pointer" }}
                                        onClick={(e) =>
                                            setDialogRef({
                                                ref: e.currentTarget,
                                                vid: i.toString(),
                                            })
                                        }
                                    />
                                </Box>
                            </Box>
                        </Tooltip>
                    </Stack>
                ))}
            <Popover
                open={Boolean(dialogRef)}
                anchorEl={dialogRef?.ref}
                onClose={() => setDialogRef(null)}
            >
                <Stack p={2} gap={1}>
                    <Typography>Choose Voice</Typography>
                    <Stack direction={"row"} gap={1} flexWrap={"wrap"}>
                        {voices
                            .filter(
                                (v) =>
                                    !selectedVoices
                                        .map((v) => v.id)
                                        .includes(v.id)
                            )
                            .map((v) => (
                                <Tooltip title={v.name} key={v.id}>
                                    <Avatar
                                        src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                                            "voice_models/avatars/thumbs/"
                                        )}${v.id}_200x200?alt=media`}
                                        onClick={() => {
                                            if (dialogRef?.vid) {
                                                const key = dialogRef.vid;
                                                const newObj = {
                                                    ...voiceSlotObj,
                                                };
                                                newObj[key] = {
                                                    id: v.id,
                                                    name: v.name,
                                                    avatar: `https://voxaudio.nusic.fm/${encodeURIComponent(
                                                        "voice_models/avatars/thumbs/"
                                                    )}${
                                                        v.id
                                                    }_200x200?alt=media`,
                                                };
                                                setSelectedVoices(
                                                    Object.values(
                                                        newObj
                                                    ).filter((v) => v !== null)
                                                );
                                                setVoiceSlotObj(newObj);
                                                setDialogRef(null);
                                            }
                                        }}
                                    />
                                </Tooltip>
                            ))}
                        <Box
                            width={38}
                            height={38}
                            border="2px solid"
                            display={"flex"}
                            alignItems="center"
                            justifyContent={"center"}
                            borderRadius={"50%"}
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                if (dialogRef) {
                                    // Delete By ID
                                    const { [dialogRef.vid]: _, ...rest } =
                                        voiceSlotObj;
                                    rest[dialogRef.vid] = null;
                                    setSelectedVoices(
                                        Object.values(rest).filter(
                                            (v) => v !== null
                                        ) as GameVoiceInfo[]
                                    );
                                    setVoiceSlotObj(rest);
                                    setDialogRef(null);
                                }
                            }}
                        >
                            <RemoveIcon fontSize="small" color="secondary" />
                        </Box>
                    </Stack>
                </Stack>
            </Popover>
        </Stack>
    );
};

export default SelectVoices;

