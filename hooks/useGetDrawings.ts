import useAuth from "@/contexts/AuthContext";
import { createDrawingStore, createPhotoStore, getDrawingStore, getPhotos, updateDrawingStore, updatePhotoStore } from "@/lib/firestore";
import { DrawingData, DrawingDocData, Photo, PhotoData, PhotoDocData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateDrawing = (month: number, year: number) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (drawingData: DrawingData) => {
      if (!user?.uid) throw new Error("User not found");
      await createDrawingStore(user?.uid, drawingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["drawings", user?.uid, month, year],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetDrawings = (month: number, year: number) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["drawings", user?.uid, month, year],
    enabled: !!month || !!year,
    queryFn: async () => {
      if (!user?.uid) throw new Error("User not found");
      const drawings = await getDrawingStore(user?.uid, month, year);
      return drawings;
    },
    select: (data) => data as DrawingDocData[],
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useUpdateDrawing = (month: number, year: number) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      drawingData,
      drawingId,
    }: {
      drawingData: Partial<DrawingData>;
      drawingId: string;
    }) => {
      if (!user?.uid) throw new Error("User not found");
      await updateDrawingStore(user?.uid, drawingData as DrawingData, drawingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["drawings", user?.uid, month, year],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
