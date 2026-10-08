import { crc32, createZip } from './zip'

/** Reads the archive back via its central directory, like a real unzip tool. */
function readZip(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const endAt = bytes.length - 22
  expect(view.getUint32(endAt, true)).toBe(0x06054b50)
  const count = view.getUint16(endAt + 10, true)
  let at = view.getUint32(endAt + 16, true)
  const decoder = new TextDecoder()
  const files: Record<string, string> = {}
  for (let i = 0; i < count; i++) {
    expect(view.getUint32(at, true)).toBe(0x02014b50)
    const crc = view.getUint32(at + 16, true)
    const size = view.getUint32(at + 24, true)
    const nameLength = view.getUint16(at + 28, true)
    const localAt = view.getUint32(at + 42, true)
    const name = decoder.decode(bytes.subarray(at + 46, at + 46 + nameLength))
    expect(view.getUint32(localAt, true)).toBe(0x04034b50)
    const dataAt = localAt + 30 + view.getUint16(localAt + 26, true)
    const data = bytes.subarray(dataAt, dataAt + size)
    expect(crc32(data)).toBe(crc)
    files[name] = decoder.decode(data)
    at += 46 + nameLength
  }
  return files
}

describe('createZip', () => {
  it('computes the standard CRC-32', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926)
  })

  it('round-trips files, folders and UTF-8 names', () => {
    const zip = createZip([
      { path: 'project/README.md', content: '# Héllo ✓\n' },
      { path: 'project/src/main.ts', content: 'export {}\n' },
      { path: 'project/empty.txt', content: '' },
    ])
    expect(readZip(zip)).toEqual({
      'project/README.md': '# Héllo ✓\n',
      'project/src/main.ts': 'export {}\n',
      'project/empty.txt': '',
    })
  })
})
