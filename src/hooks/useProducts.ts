import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/content";

const transformProduct = (docId: string, data: Product): Product => ({
  ...data,
  slug: data.slug ?? docId,
});

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "products"));
      return snapshot.docs.map((docSnap) => transformProduct(docSnap.id, docSnap.data() as Product));
    },
  });
};

export const useProduct = (slug?: string) => {
  return useQuery<Product>({
    queryKey: ["product", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) throw new Error("Missing product slug");
      const snapshot = await getDoc(doc(db, "products", slug));
      if (!snapshot.exists()) {
        throw new Error("Product not found");
      }
      return transformProduct(snapshot.id, snapshot.data() as Product);
    },
  });
};
