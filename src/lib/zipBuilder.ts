import zlib from "zlib";

/**
 * Lightweight, zero-dependency ZIP archive builder using native Node.js zlib.
 * Generates fully standard PKZip 2.0 archives compatible with Windows, macOS, and Linux.
 */

export interface ZipFileInput {
  name: string;
  content: Buffer | string;
}

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function computeCrc32(buf: Buffer): number {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

export function buildZipArchive(files: ZipFileInput[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const filenameBuf = Buffer.from(file.name, "utf8");
    const dataBuf = Buffer.isBuffer(file.content)
      ? file.content
      : Buffer.from(file.content, "utf8");

    const crc = computeCrc32(dataBuf);
    const compressed = zlib.deflateRawSync(dataBuf);
    const useCompressed = compressed.length < dataBuf.length;
    const finalData = useCompressed ? compressed : dataBuf;
    const method = useCompressed ? 8 : 0;

    // 1. Local File Header (30 bytes + name)
    const lh = Buffer.alloc(30 + filenameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0); // Local header signature
    lh.writeUInt16LE(20, 4); // Version needed to extract (2.0)
    lh.writeUInt16LE(0, 6); // General purpose bit flag
    lh.writeUInt16LE(method, 8); // Compression method (0=stored, 8=deflated)
    lh.writeUInt16LE(0, 10); // Last mod file time
    lh.writeUInt16LE(0, 12); // Last mod file date
    lh.writeUInt32LE(crc, 14); // CRC-32
    lh.writeUInt32LE(finalData.length, 18); // Compressed size
    lh.writeUInt32LE(dataBuf.length, 22); // Uncompressed size
    lh.writeUInt16LE(filenameBuf.length, 26); // File name length
    lh.writeUInt16LE(0, 28); // Extra field length
    filenameBuf.copy(lh, 30);

    localHeaders.push(lh, finalData);

    // 2. Central Directory Header (46 bytes + name)
    const ch = Buffer.alloc(46 + filenameBuf.length);
    ch.writeUInt32LE(0x02014b50, 0); // Central file header signature
    ch.writeUInt16LE(20, 4); // Version made by
    ch.writeUInt16LE(20, 6); // Version needed to extract
    ch.writeUInt16LE(0, 8); // General purpose bit flag
    ch.writeUInt16LE(method, 10); // Compression method
    ch.writeUInt16LE(0, 12); // Last mod file time
    ch.writeUInt16LE(0, 14); // Last mod file date
    ch.writeUInt32LE(crc, 16); // CRC-32
    ch.writeUInt32LE(finalData.length, 20); // Compressed size
    ch.writeUInt32LE(dataBuf.length, 24); // Uncompressed size
    ch.writeUInt16LE(filenameBuf.length, 28); // File name length
    ch.writeUInt16LE(0, 30); // Extra field length
    ch.writeUInt16LE(0, 32); // File comment length
    ch.writeUInt16LE(0, 34); // Disk number start
    ch.writeUInt16LE(0, 36); // Internal file attributes
    ch.writeUInt32LE(0, 38); // External file attributes
    ch.writeUInt32LE(offset, 42); // Relative offset of local header
    filenameBuf.copy(ch, 46);

    centralHeaders.push(ch);
    offset += lh.length + finalData.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const ch of centralHeaders) {
    centralDirSize += ch.length;
  }

  // 3. End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // End of central dir signature
  eocd.writeUInt16LE(0, 4); // Number of this disk
  eocd.writeUInt16LE(0, 6); // Number of the disk with start of central directory
  eocd.writeUInt16LE(files.length, 8); // Total number of entries in central dir on this disk
  eocd.writeUInt16LE(files.length, 10); // Total number of entries in central dir
  eocd.writeUInt32LE(centralDirSize, 12); // Size of the central directory
  eocd.writeUInt32LE(centralDirOffset, 16); // Offset of start of central directory
  eocd.writeUInt16LE(0, 20); // ZIP file comment length

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

