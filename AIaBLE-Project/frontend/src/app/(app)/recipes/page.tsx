"use client";

import { useEffect } from "react";
import api from "@/lib/axios";

export default function RecipesPage() {
  useEffect(() => {
    api.get("/api/health")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main>
      <h1>Recipes</h1>
    </main>
  );
}
