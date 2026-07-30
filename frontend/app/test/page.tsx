"use client";

import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";

export default function TestPage() {
  useEffect(() => {
    async function test() {
      const result = await supabase.from("topics").select("*");

      console.log("DATA:", result.data);
      console.log("ERROR:", result.error);
      console.log("STATUS:", result.status);
      console.log("STATUS TEXT:", result.statusText);
    }

    test();
  }, []);

  return <h1>Testing Supabase...</h1>;
}