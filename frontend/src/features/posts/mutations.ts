import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import { createPost } from "./api";
import { queryKeys } from "../../lib/queryKeys";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onMutate() {
      toast.loading(
        "Publishing...",
        {
          id: "publish",
        }
      );
    },

    onSuccess() {
      toast.success(
        "Story published.",
        {
          id: "publish",
        }
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.profile,
      });
    },

    onError() {
      toast.error(
        "Unable to publish.",
        {
          id: "publish",
        }
      );
    },
  });
}
