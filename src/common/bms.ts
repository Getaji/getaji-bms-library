import { Song } from "./types";

export const makeLR2IRUrl = (md5: string) => "http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + md5;
export const makeMochaUrl = (sha256: string) => "https://mocha-repository.info/song.php?sha256=" + sha256;

export const JUDGE_RANK_MAP: Record<string, string> = {
  "100": "EASY",
  "75": "NORMAL",
  "50": "HARD",
  "25": "VERYHARD",
};

export const getJudge = (judge: number) => {
  if (judge <= 25) return "VERYHARD";
  if (judge <= 50) return "HARD";
  if (judge <= 75) return "NORMAL";
  if (judge <= 100) return "EASY";
  return "VERYEASY";
}

export function getBpmText(song: Song) {
  if (song.minbpm === song.maxbpm) {
    return String(song.minbpm);
  }

  return `${song.minbpm}-(${song.mainbpm})-${song.maxbpm}`;
}

export function calcTotal(notes: number) {
  return Math.max(260.0, (7.605 * notes) / (0.01 * notes + 6.5));
}

type Feature = {
  num: number;
  id: string;
  jp: string;
  en: string;
};

function feature(
  num: number,
  id: string,
  jp: string,
  en: string
) {
  return { num, id, jp, en };
}

const FEATURES: Feature[] = [
  feature(1, "undefined-ln", "LN", "LN"),
  feature(2, "minenote", "地雷", "Mine"),
  feature(4, "random", "ランダム", "Random"),
  feature(8, "longnote", "強制LN", "Force LN"),
  feature(16, "chargenote", "強制CN", "Force CN"),
  feature(32, "hellchargenote", "強制HCN", "Force HCN"),
  feature(64, "stop-sequence", "ストップシーケンス", "Stop Sequence"),
  feature(128, "scroll", "スクロール", "scroll"),
];

export function getFeatures(song: Song) {
  return FEATURES.filter((feature) => (song.feature & feature.num) !== 0);
}

export function getTimeString(song: Song) {
  const minutes = Math.floor(song.length / (60 * 1000));
  const seconds = Math.floor(song.length % (60 * 1000) / 1000);
  return minutes + ":" + String(seconds).padStart(2, "0");
}
