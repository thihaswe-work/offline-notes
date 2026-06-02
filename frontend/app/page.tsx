"use client";

import { useEffect, useState } from "react";
import InstallButton from "./components/installButton";

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
};

const API_URL = "http://localhost:4000";

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/notes`);

        if (!res.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await res.json();
        console.log("object", data);
        setNotes(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <InstallButton />
        <h1 className="text-3xl font-bold text-zinc-900">Notes</h1>

        {loading && <p className="text-sm text-zinc-500">Loading notes...</p>}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && notes.length === 0 && (
          <p className="text-sm text-zinc-500">No notes found</p>
        )}

        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl bg-white p-4 shadow">
              <h2 className="text-lg font-semibold text-zinc-900">
                {note.title}
              </h2>

              <p className="mt-2 text-sm text-zinc-600">{note.content}</p>

              {note.createdAt && (
                <p className="mt-2 text-xs text-zinc-400">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
