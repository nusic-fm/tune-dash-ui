import { useCallback, useEffect, useRef } from "react";
import { AdController, ShowPromiseResult } from "../types/adsgram";

export interface useAdsgramParams {
  blockId: string;
  onReward: () => void;
  onError?: (result: ShowPromiseResult) => void;
}

export function useAdsgram({
  blockId,
  onReward,
  onError,
}: useAdsgramParams): () => Promise<void> {
  const AdControllerRef = useRef<AdController | undefined>(undefined);

  useEffect(() => {
    AdControllerRef.current = (window as any).Adsgram?.init({
      blockId,
      debug: true,
      debugBannerType: "FullscreenMedia",
    });
  }, [blockId]);

  return useCallback(async () => {
    if (AdControllerRef.current) {
      AdControllerRef.current
        .show()
        .then(() => {
          // user watch ad till the end or close it in interstitial format
          onReward();
        })
        .catch((result: ShowPromiseResult) => {
          // user get error during playing ad
          onError?.(result);
        });
    } else {
      onError?.({
        error: true,
        done: false,
        state: "load",
        description: "Adsgram script not loaded",
      });
    }
  }, [onError, onReward]);
}