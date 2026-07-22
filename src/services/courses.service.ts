import api from "@/lib/api";

export const getPublicCourses = async () => {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID;
  const res = await api.get("/api/courses/public", {
    params: { institutionId },
  });
  return Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
};
