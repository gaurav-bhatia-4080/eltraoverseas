import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Vlog } from "@/types/content";

const transformVlog = (docId: string, data: Vlog): Vlog => ({
  ...data,
  slug: data.slug ?? docId,
});

export const useVlogs = () => {
  return useQuery<Vlog[]>({
    queryKey: ["vlogs"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "vlogs"));
      return snapshot.docs.map((docSnap) => transformVlog(docSnap.id, docSnap.data() as Vlog));
    },
  });
};

export const useVlog = (slug?: string) => {
  return useQuery<Vlog>({
    queryKey: ["vlog", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) throw new Error("Missing vlog slug");
      const snapshot = await getDoc(doc(db, "vlogs", slug));
      if (!snapshot.exists()) {
        throw new Error("Vlog not found");
      }
      return transformVlog(snapshot.id, snapshot.data() as Vlog);
    },
  });
};
