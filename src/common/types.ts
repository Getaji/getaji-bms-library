export type Song = {
  md5: string;
  sha256: string;
  genre: string;
  title: string;
  subtitle: string;
  artist: string;
  subartist: string;
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
