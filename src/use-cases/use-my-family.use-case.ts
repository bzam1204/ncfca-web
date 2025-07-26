import {FamilyResponseDto} from "@/contracts/api/family.dto";
import {useMutation} from "@tanstack/react-query";

export async function getMyFamily(accessToken: string): Promise<FamilyResponseDto | null> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const res = await fetch(`${BACKEND_URL}/dependants/my-family`, {
      headers : {'Authorization' : `Bearer ${accessToken}`},
      next : {tags : ['family-status']},
    });
    if (!res.ok) {
      console.error("API Error:", res.status, await res.text());
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Network Error fetching family data:", error);
    return null;
  }
}

export function useMyFamily() {
  return useMutation({
    mutationFn : getMyFamily,
  });
}
