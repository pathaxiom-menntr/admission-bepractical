import api from "@/lib/api";

export const getOnboardingLead = async (leadId: string) => {
  if (!leadId) throw new Error("No Lead ID provided");
  const res = await api.get(`/api/leads/public/onboarding/${leadId}`);
  return res.data?.data;
};

export const submitOnboardingLead = async (leadId: string, data: any) => {
  if (!leadId) throw new Error("No Lead ID provided");
  const res = await api.post(`/api/leads/public/onboarding/${leadId}`, data);
  return res.data;
};
