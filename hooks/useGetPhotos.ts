import useAuth from "@/contexts/AuthContext";
import { createPhotoStore, getPhotos, updatePhotoStore } from "@/lib/firestore";
import { Photo, PhotoData, PhotoDocData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreatePhoto = (month: number, year: number) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photoData: PhotoData) => {
      if (!user?.uid) throw new Error("User not found");
      await createPhotoStore(user?.uid, photoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["photos", user?.uid, month, year],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetPhotos = (month: number, year: number) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["photos", user?.uid, month, year],
    enabled: !!month || !!year,
    queryFn: async () => {
      if (!user?.uid) throw new Error("User not found");
      const photos = await getPhotos(user?.uid, month, year);
      return photos;
    },
    select: (data) => data as PhotoDocData[],
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useUpdatePhoto = (month: number, year: number) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      photoData,
      photoId,
    }: {
      photoData: Partial<PhotoData>;
      photoId: string;
    }) => {
      if (!user?.uid) throw new Error("User not found");
      await updatePhotoStore(user?.uid, photoData, photoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["photos", user?.uid, month, year],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
