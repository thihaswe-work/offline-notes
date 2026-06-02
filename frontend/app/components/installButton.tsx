"use client";

import { useEffect, useState } from "react";

let deferredPrompt: any;

export default function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    deferredPrompt = null;
    setCanInstall(false);

    console.log(outcome); // accepted / dismissed
  };

  if (!canInstall) return null;

  return (
    <button
      onClick={handleInstall}
      className="px-4 py-2 bg-black text-white rounded"
    >
      Install App
    </button>
  );
}
