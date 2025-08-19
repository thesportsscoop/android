import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
import { ReadableStream } from 'web-streams-polyfill/dist/ponyfill.js';
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}
