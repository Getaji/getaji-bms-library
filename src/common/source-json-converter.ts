import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { ParsedTable, Song, Table } from "./types";

/**
 * beatorajaのカスタムフォルダのJSONオブジェクトから不要なデータを削除して返します。
 * また、フォルダ名の前方に "GL" が付いている場合に除去します。
 */
export function parseJSON(rawTable: Table): Table<Required<Song>> {
  return {
    name: rawTable.name,
    folder: rawTable.folder.map((folder) => ({
      name: folder.name.startsWith("GL")
        ? folder.name.slice(2)
        : folder.name,
      songs: folder.songs.map((song) => ({
        md5: song.md5,
        sha256: song.sha256,
        genre: song.genre,
        title: song.title,
        subtitle: song.subtitle,
        artist: song.artist,
        subartist: song.subartist,
      })),
    })),
  };
}

export async function parseJSONFile(filepath: string, encoding: BufferEncoding = "utf-8") {
  const file = await readFile(filepath);
  const dataStr = file.toString(encoding);
  const json = JSON.parse(dataStr);

  return parseJSON(json);
}

/**
 * beatorajaが出力した folder.json を変換して保存します。
 * 変換の内容は `parseJSON` を参照してください。
 * JSON文字列はフォーマットされずに1行で保存されます。
 * 
 * folder.json が変換済み（文字列が1行かつ末尾改行なし）の場合は変換をスキップします。
 * 
 * @param filepath folder.jsonのパス
 * @param encoding 文字コード
 */
export async function parseAndSaveJSONFile(filepath: string, encoding: BufferEncoding = "utf-8") {
  const file = await readFile(filepath);
  const dataStr = file.toString(encoding);

  if (dataStr.endsWith("\n}")) {
    const json = JSON.parse(dataStr);
    await writeFile(filepath, JSON.stringify(json));
    return true;
  } else {
    return false;
  }
}
