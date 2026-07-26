"use client";
import { useState, useCallback } from "react";
// npm install pdfjs-dist
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function ResumeDropzone() {
  const [status, setStatus] = useState<"idle" | "parsing" | "saving" | "done" | "error">("idle");

  const extractText = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  };

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") return alert("PDF only");
    setStatus("parsing");
    const rawText = await extractText(file);

    setStatus("saving");
    const fileBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const res = await fetch("/api/resume/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawText, fileName: file.name, fileBase64 }),
    });
    setStatus(res.ok ? "done" : "error");
  }, []);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
      className="border-2 border-dashed border-[#D4AF6A] rounded-xl p-8 text-center bg-[#FAF6EF] cursor-pointer"
      onClick={() => document.getElementById("resume-input")?.click()}
    >
      <input id="resume-input" type="file" accept=".pdf" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      <p className="text-[#8A7754]">
        {status === "idle" && "Drag & drop your resume PDF, or click to browse"}
        {status === "parsing" && "Extracting text..."}
        {status === "saving" && "Saving to your profile..."}
        {status === "done" && "✅ Resume saved!"}
        {status === "error" && "❌ Something went wrong"}
      </p>
    </div>
  );
}