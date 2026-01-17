export type SimpleSong = {
  md5: string;
  sha256: string;
  genre: string;
  title: string;
  subtitle: string;
  artist: string;
  subartist: string;
  folder: string;
  accuracy: string;
  comment: string;
  url: string;
  url_diff: string;
  notes: number;
  total: number;
};

export type Song = {
  md5: string;
  sha256: string;
  genre: string;
  title: string;
  subtitle: string;
  artist: string;
  subartist: string;
  content: number;
  folder: string;
  level: number;
  difficulty: number;
  maxbpm: number;
  minbpm: number;
  mainbpm: number;
  length: number;
  judge: number;
  feature: number;
  notes: number;
  n: number;
  ln: number;
  s: number;
  ls: number;
  density: number;
  peakdensity: number;
  enddensity: number;
  total: number;
  accuracy: string;
  comment: string;
  url: string;
  url_diff: string;
};

export type Table<S extends Partial<Song> = Song> = {
  name: string;
  folder: {
    name: string;
    songs: S[];
  }[];
};

export type ParsedTable<S extends Partial<Song> = Song> = {
  name: string;
  folder: {
    name: string;
    songs: (S & {
      titleFull: string;
      artistFull: string;
    })[];
  }[];
};
