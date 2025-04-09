import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ShieldCheck, Unlock } from "lucide-react";

function deriveKeyFromPassword(password: string): number {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash * 31 + password.charCodeAt(i)) % 256;
  }
  return hash;
}

export default function AsciiXOREncryptor() {
  const [mode, setMode] = useState("encrypt");
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const key = deriveKeyFromPassword(password);

  const handleProcess = async () => {
    if (!text || !password) {
      setResult("⚠️ 입력값 또는 비밀번호가 비어있습니다.");
      return;
    }

    if (mode === "encrypt") {
      try {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const encrypted = bytes.map((b) => b ^ key);
        const encryptedStr = String.fromCharCode(...encrypted);
        const base64 = btoa(encryptedStr);
        setResult(base64);
      } catch (err) {
        setResult("⚠️ 암호화 중 오류가 발생했습니다.");
      }
    } else {
      try {
        const binaryStr = atob(text);
        const encrypted = [...binaryStr].map((c) => c.charCodeAt(0));
        const decryptedBytes = encrypted.map((b) => b ^ key);
        const decoder = new TextDecoder();
        const decryptedText = decoder.decode(new Uint8Array(decryptedBytes));
        setResult(decryptedText);
      } catch (err) {
        setResult("⚠️ 복호화 실패: 올바른 Base64 형식이 아닙니다.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center text-indigo-600">
        🧠 모질띨빡 암호기
      </h1>

      <div className="border rounded-lg p-4 shadow space-y-4">
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger>
            <div className="w-full">
              <SelectValue placeholder="모드 선택" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="encrypt">암호화</SelectItem>
            <SelectItem value="decrypt">복호화</SelectItem>
          </SelectContent>
        </Select>

        <input
          placeholder={
            mode === "encrypt"
              ? "평문 입력 (예: 안녕하세요)"
              : "암호문 입력 (Base64)"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          placeholder="비밀번호 기반 키 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleProcess}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700"
        >
          {mode === "encrypt" ? "암호화" : "복호화"}
        </button>
      </div>

      {result && (
        <div className="border rounded-lg p-4 shadow space-y-2">
          {mode === "encrypt" ? (
            <div className="flex items-center space-x-2">
              <ShieldCheck className="text-green-500" />
              <strong>암호문 (Base64):</strong> <span>{result}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Unlock className="text-yellow-500" />
              <strong>복호화 결과:</strong> <span>{result}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
