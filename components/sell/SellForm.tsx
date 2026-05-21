"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface FormState {
  name: string;
  email: string;
  description: string;
}

export default function SellForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", description: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).slice(0, 8);
    setFiles(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    const supabase = createClient();
    const photoUrls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `submissions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("sell-photos").upload(path, file);

      if (!uploadErr) {
        const { data: { publicUrl } } = supabase.storage.from("sell-photos").getPublicUrl(path);
        photoUrls.push(publicUrl);
      }
    }

    const { error: insertErr } = await supabase.from("sell_submissions").insert({
      name: form.name,
      email: form.email,
      description: form.description,
      photo_urls: photoUrls,
    });

    if (insertErr) {
      setError("Something went wrong. Please try again or email us directly.");
      setUploading(false);
      return;
    }

    setSubmitted(true);
    setUploading(false);
  };

  if (submitted) {
    return (
      <div className="bg-(--color-surface-container-low) border border-(--color-outline-variant)/30 p-10 text-center">
        <span className="material-symbols-outlined text-4xl text-(--color-tertiary) block mb-4">check_circle</span>
        <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">Submission received.</h2>
        <p className="font-body text-base text-(--color-on-surface-variant)">
          We&rsquo;ll review your pieces and respond within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-(--color-error-container) text-(--color-on-error-container) font-technical text-[12px] p-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Your Name</label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            required
            className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
            placeholder="Full name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            required
            className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">
          Describe Your Pieces
        </label>
        <textarea
          value={form.description}
          onChange={set("description")}
          required
          rows={5}
          className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors resize-none"
          placeholder="Brand, era, condition, sizing, quantity — anything helps."
        />
      </div>

      {/* Photo upload */}
      <div className="flex flex-col gap-3">
        <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">
          Photos (up to 8)
        </label>
        <label className="border-2 border-dashed border-(--color-outline-variant) p-8 text-center cursor-pointer hover:border-(--color-primary) transition-colors group">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="sr-only"
          />
          <span className="material-symbols-outlined text-3xl text-(--color-outline) group-hover:text-(--color-primary) transition-colors block mb-2">
            cloud_upload
          </span>
          <span className="font-body text-base text-(--color-on-surface-variant) group-hover:text-(--color-primary) transition-colors">
            {files.length > 0 ? `${files.length} file${files.length !== 1 ? "s" : ""} selected` : "Click to upload photos"}
          </span>
          <span className="font-technical text-[11px] text-(--color-on-surface-variant)/60 block mt-1">JPG, PNG, HEIC · Max 10MB each</span>
        </label>

        {files.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {files.map((file, i) => (
              <div key={i} className="w-16 h-16 bg-(--color-surface-container) border border-(--color-outline-variant)/30 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-(--color-primary) text-white py-5 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors disabled:opacity-60"
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
            Uploading…
          </span>
        ) : (
          "Send Submission"
        )}
      </button>
    </form>
  );
}
