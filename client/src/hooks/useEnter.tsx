import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";

const useEnter = () => {
  const handleEnter = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();

      // invoke("hide");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEnter);

    return () => window.removeEventListener("keydown", handleEnter);
  }, []);
};

export default useEnter;
