import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  createMemoStore,
  getMemoStore,
  updateMemoStore,
} from "@/lib/firestore";
import { MemoData, MemoDocData } from "@/types";
import useAuth from "@/contexts/AuthContext";

export const useGetMemos = (photoId: string, photoDocId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["memos", user?.uid, photoId],
    enabled: !!user?.uid && !!photoId,
    queryFn: async () => {
      if (!user?.uid || !photoId) throw new Error("User or photo not found");
      const memos = await getMemoStore(user?.uid, photoId, photoDocId);
      return memos;
    },
    select: (data) => data as MemoDocData[],
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useCreateMemo = (photoDocId: string, photoId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memoData: MemoData) => {
      if (!user?.uid || !photoDocId) throw new Error("User or photo not found");
      await createMemoStore(user?.uid, memoData, photoDocId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["memos", user?.uid, photoId],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateMemo = (photoDocId: string, photoId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      memoData,
      memoId,
    }: {
      memoData: Partial<MemoData>;
      memoId: string;
    }) => {
      if (!user?.uid || !photoDocId) throw new Error("User or photo not found");
      await updateMemoStore(user?.uid, memoData, photoDocId, memoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["memos", user?.uid, photoId],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
