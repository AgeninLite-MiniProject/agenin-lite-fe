import { getDownlineDetail } from "@/lib/api/downline.api"
import type { DownlineDetailResponse } from "@/types/downline.type"
import { useQuery } from "@tanstack/react-query"

export const useDownlineDetail = (id: string) => {
    return useQuery<DownlineDetailResponse, Error> ({
        queryKey: ["downline-detail", id],
        queryFn: () => getDownlineDetail(id),
        enabled: !!id,
    })
}