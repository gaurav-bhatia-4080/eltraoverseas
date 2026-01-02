import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HomeContent } from "@/types/content";

export const useHomeContent = () => {
  return useQuery<HomeContent>({
    queryKey: ["home-content"],
    queryFn: async () => {
      const snapshot = await getDoc(doc(db, "siteContent", "home"));
      if (!snapshot.exists()) {
        throw new Error("Home content is missing in Firestore");
      }
      return snapshot.data() as HomeContent;
    },
  });
};
