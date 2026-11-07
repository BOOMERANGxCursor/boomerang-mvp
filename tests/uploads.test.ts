import { expect, it } from "vitest";
import { fileKind, validateFile, decodeText } from "../src/lib/uploads";

it("classifies supported input types without pretending unknown files are text",()=>{
 expect(fileKind("notes.txt")).toBe("text");expect(fileKind("notes.pdf")).toBe("document");
 expect(fileKind("scan.PNG")).toBe("image");expect(fileKind("talk.mp3")).toBe("audio");expect(fileKind("talk.mp4")).toBe("video");
 expect(()=>fileKind("macro.exe")).toThrow(/supported/i);
});
it("distinguishes an audio WebM recording from a video container",()=>{
 expect(fileKind("recording.webm","audio/webm")).toBe("audio");
});
it("rejects renamed files and empty or excessive uploads",()=>{
 expect(()=>validateFile("fake.pdf",new TextEncoder().encode("not a PDF"))).toThrow();
 expect(()=>validateFile("empty.txt",new Uint8Array())).toThrow();
 expect(()=>validateFile("huge.txt",new Uint8Array(4_000_001))).toThrow(/large/i);
});
it("reads actual UTF-8 text and rejects binary disguised as notes",()=>{
 expect(decodeText(new TextEncoder().encode("handover notes"))).toBe("handover notes");
 expect(()=>decodeText(new Uint8Array([0,255,0]))).toThrow();
});
