import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContactSubmission } from "@/types/content";

const normalizeSubmission = (docId: string, data: Record<string, any>): ContactSubmission => {
  const createdAt = data.createdAt?.toDate
    ? data.createdAt.toDate().toISOString()
    : typeof data.createdAt === "string"
      ? data.createdAt
      : null;

  return {
    id: docId,
    name: data.name ?? "",
    email: data.email ?? "",
    company: data.company ?? "",
    country: data.country ?? "",
    phone: data.phone ?? "",
    message: data.message ?? "",
    status: data.status ?? "new",
    createdAt,
  };
};

export const useContactSubmissions = () => {
  return useQuery<ContactSubmission[]>({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const submissionsQuery = query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(submissionsQuery);
      return snapshot.docs.map((docSnap) => normalizeSubmission(docSnap.id, docSnap.data()));
    },
  });
};
