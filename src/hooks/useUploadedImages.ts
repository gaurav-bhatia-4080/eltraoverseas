import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UploadedImage } from "@/types/content";

const normalizeImage = (docId: string, data: Record<string, unknown>): UploadedImage => {
  const uploadedAt = (data.uploadedAt as { toDate?: () => Date })?.toDate
    ? (data.uploadedAt as { toDate: () => Date }).toDate().toISOString()
    : typeof data.uploadedAt === "string"
      ? data.uploadedAt
      : new Date().toISOString();

  return {
    id: docId,
    filename: (data.filename as string) ?? "",
    siteUrl: (data.siteUrl as string) ?? "",
    githubRawUrl: (data.githubRawUrl as string) ?? "",
    mimeType: (data.mimeType as string) ?? "",
    size: (data.size as number) ?? 0,
    uploadedAt,
  };
};

export const useUploadedImages = () => {
  return useQuery<UploadedImage[]>({
    queryKey: ["uploaded-images"],
    queryFn: async () => {
      const q = query(collection(db, "uploadedImages"), orderBy("uploadedAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => normalizeImage(docSnap.id, docSnap.data()));
    },
  });
};
