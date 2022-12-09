export const makeLR2IRUrl = (md5: string) => "http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + md5;
export const makeMochaUrl = (sha256: string) => "https://mocha-repository.info/song.php?sha256=" + sha256;

export const JUDGE_RANK_MAP: Record<string, string> = {
  "100": "EASY",
  "75": "NORMAL",
  "50": "HARD",
  "25": "VERY HARD",
};

export const getJudge = (judge: number) => {
  if (judge <= 25) return "VERY HARD";
  if (judge <= 50) return "HARD";
  if (judge <= 75) return "NORMAL";
  if (judge <= 100) return "EASY";
  return "VERY EASY";
}
