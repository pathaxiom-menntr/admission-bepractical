"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getOnboardingLead, submitOnboardingLead } from "@/services/onboarding.service";

// Zod validation schema matching backend expectations
const onboardingSchema = z
  .object({
    // Step 1: Personal & Education Details
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of birth is required"),
    address: z.string().trim().min(5, "Address must be at least 5 characters"),
    guardianName: z
      .string()
      .trim()
      .min(2, "Guardian/Parent name must be at least 2 characters")
      .regex(/^[A-Za-z\s]+$/, "Name can only contain alphabets"),
    guardianPhone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
    collegeName: z.string().trim().min(3, "College Name is required"),
    qualification: z.string().min(1, "Degree / Course is required"),
    yearOfPassing: z.coerce
      .number()
      .int()
      .min(1990, "Enter a valid year")
      .max(2035, "Enter a valid year"),

    // Step 2: Course Details
    courseId: z.string().min(1, "Course selection is required"),
    duration: z.string().optional(),

    // Step 3: Fees & Payment
    totalFees: z.coerce.number().min(0, "Total fee must be positive"),
    feePaid: z.coerce.number().min(0, "Fee paid must be positive"),
    paymentMode: z.string().min(1, "Payment mode is required"),
    paymentType: z.enum(["FULL", "PARTIAL"]),
    nextDueDate: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.paymentType === "PARTIAL" && data.totalFees - data.feePaid > 0) {
        return !!data.nextDueDate;
      }
      return true;
    },
    {
      message: "Next balance due date is required for installment plans",
      path: ["nextDueDate"],
    },
  );

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const DEGREES_LIST = [
  "B.E / B.Tech",
  "BCA",
  "B.Sc",
  "M.Tech / M.E",
  "MCA",
  "M.Sc",
  "MBA",
  "B.Com",
  "BBA",
  "Diploma",
  "Other",
];



export default function OnboardingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const leadId = searchParams.get("leadId") || searchParams.get("id") || "";

  const [currentStep, setCurrentStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isCollegePreFilled, setIsCollegePreFilled] = useState(false);

  // Fetch pre-filled lead details and courses list
  const {
    data: leadData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["onboardingLead", leadId],
    queryFn: () => getOnboardingLead(leadId),
    enabled: !!leadId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema) as any,
    defaultValues: {
      gender: "",
      dob: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
      collegeName: "",
      qualification: "",
      yearOfPassing: new Date().getFullYear(),
      courseId: "",
      duration: "",
      totalFees: 0,
      feePaid: 0,
      paymentMode: "ONLINE",
      paymentType: "FULL",
      nextDueDate: "",
    },
  });

  // Watch parameters for dynamic updates
  const watchCourseId = watch("courseId");
  const watchTotalFees = watch("totalFees");
  const watchFeePaid = watch("feePaid");
  const watchPaymentType = watch("paymentType");
  const selectedGender = watch("gender");

  // Look up current course information
  const selectedCourse = leadData?.courses?.find(
    (c: any) => c.id === watchCourseId,
  );

  // Auto-populate course duration & fee details
  useEffect(() => {
    if (selectedCourse) {
      setValue("duration", selectedCourse.duration || "3 Months");
      setValue("totalFees", selectedCourse.price || 35000);
    } else {
      setValue("duration", "");
    }
  }, [selectedCourse, setValue]);

  // Handle Full vs Partial Payment type updates
  useEffect(() => {
    if (watchPaymentType === "FULL" && watchTotalFees) {
      setValue("feePaid", watchTotalFees);
    } else if (
      watchPaymentType === "PARTIAL" &&
      watchTotalFees &&
      watchFeePaid === watchTotalFees
    ) {
      setValue("feePaid", Math.floor(watchTotalFees / 2));
    }
  }, [watchPaymentType, watchTotalFees, setValue]);

  // Prefill lead courseId and collegeName if provided on load
  useEffect(() => {
    if (leadData?.lead) {
      if (leadData.lead.courseId) {
        setValue("courseId", leadData.lead.courseId);
      }
      if (leadData.lead.collegeName) {
        setValue("collegeName", leadData.lead.collegeName);
        setIsCollegePreFilled(true);
      }
    }
  }, [leadData, setValue]);

  // Mutation to submit the form data
  const mutation = useMutation({
    mutationFn: (formData: OnboardingFormData) =>
      submitOnboardingLead(leadId, formData),
    onSuccess: () => {
      setSubmitSuccess(true);
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    if (!leadId) {
      console.log("Mock Submit (Dev Mode):", data);
      setSubmitSuccess(true);
    } else {
      mutation.mutate(data);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "gender",
        "dob",
        "address",
        "guardianName",
        "guardianPhone",
        "collegeName",
        "qualification",
        "yearOfPassing",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ["courseId"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  if (leadId && isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-sm">
            Fetching onboarding details...
          </p>
        </div>
      </div>
    );
  }

  if (leadId && isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-md shadow-sm">
          <h3 className="font-bold text-lg">Failed to Load Details</h3>
          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Lead not found or onboarding is already complete."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="max-w-md bg-white border border-emerald-100 p-8 rounded-3xl shadow-[0px_8px_32px_rgba(16,185,129,0.08)] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-montserrat">
            Onboarding Completed!
          </h2>
          <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
            Thank you,{" "}
            <strong className="text-gray-800">
              {leadData?.lead?.firstName || "Student"}
            </strong>
            . Your onboarding details have been submitted successfully.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            You will receive a confirmation email shortly. Our admissions
            counselor will guide you on the next steps.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 w-full py-3 rounded-xl text-white font-semibold shadow-md bg-[linear-gradient(135deg,#4A31F4_20%,#422CD5_50%,#2160D6_75%,#3A9CFC_100%)] hover:opacity-95 transition cursor-pointer"
          >
            Go to Admission Portal
          </button>
        </div>
      </div>
    );
  }

  const balanceAmount = Math.max(
    0,
    (Number(watchTotalFees) || 0) - (Number(watchFeePaid) || 0),
  );

  return (
    <div className="w-full bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-10 lg:gap-14 items-start">
        {/* Left column: AI Assistant Mascot */}
        <div className="flex flex-col items-center lg:sticky lg:top-24">
          <div className="relative flex flex-col items-center">
            {/* Mascot Image */}
            <div className="relative w-44 h-48 sm:w-56 sm:h-60 lg:w-64 lg:h-68">
              <Image
                src="/images/bot.png"
                alt="Admissions Assistant Mascot"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Chat Bubble */}
            <div className="mt-4 relative bg-white border border-gray-100 p-5 rounded-2xl max-w-[280px] shadow-[0px_4px_16px_rgba(0,0,0,0.06)] text-center text-gray-800 text-sm font-medium leading-relaxed">
              <div className="absolute top-[-8px] left-[50%] -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
              {currentStep === 1 &&
                "Great! Let's fill in your details to get started with your profile. 👍"}
              {currentStep === 2 &&
                "Here are your course enrollment details. This is set by the admissions counselor and is read-only. 🎓"}
              {currentStep === 3 &&
                "Almost done! Let's review the fees and payment details. 💳"}
            </div>

            {/* CTA Button under bubble */}
            <button className="mt-4 px-6 py-2.5 rounded-full bg-white border border-indigo-100 text-[#4A31F4] font-semibold text-sm shadow-[0px_4px_12px_rgba(74,49,244,0.08)] flex items-center gap-1.5 hover:shadow-md transition">
              Step {currentStep} of 3 <span className="text-base">→</span>
            </button>
          </div>
        </div>

        {/* Right column: Multi-Step Form */}
        <div className="flex flex-col gap-6 w-full">
          {/* Progress Steps Header */}
          <div className="w-full flex items-center justify-between sm:justify-start gap-4 sm:gap-12 py-2 overflow-x-auto select-none border-b border-gray-200/60 pb-6 mb-2">
            {/* Step 1: Personal Details */}
            <div className="flex flex-col items-center sm:items-start gap-1 min-w-[70px]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${currentStep > 1 ? "bg-emerald-500" : "bg-blue-600 ring-4 ring-blue-50/80"}`}
                >
                  {currentStep > 1 ? "✓" : "1"}
                </span>
                <span
                  className={`hidden sm:inline text-xs font-semibold uppercase tracking-wider ${currentStep >= 1 ? "text-blue-600" : "text-gray-500"}`}
                >
                  Step 1
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm font-semibold font-montserrat mt-1 ${currentStep >= 1 ? "text-blue-700" : "text-gray-500"}`}
              >
                Student Details
              </p>
            </div>

            <div
              className={`hidden sm:block flex-1 h-[2px] max-w-[60px] ${currentStep > 1 ? "bg-emerald-300" : "bg-gray-200"}`}
            />

            {/* Step 2: Course Details */}
            <div className="flex flex-col items-center sm:items-start gap-1 min-w-[70px]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${currentStep > 2 ? "bg-emerald-500 text-white" : currentStep === 2 ? "bg-blue-600 text-white ring-4 ring-blue-50/80" : "bg-gray-200 text-gray-500"}`}
                >
                  {currentStep > 2 ? "✓" : "2"}
                </span>
                <span
                  className={`hidden sm:inline text-xs font-semibold uppercase tracking-wider ${currentStep >= 2 ? "text-blue-600" : "text-gray-500"}`}
                >
                  Step 2
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm font-semibold font-montserrat mt-1 ${currentStep >= 2 ? "text-blue-700" : "text-gray-500"}`}
              >
                Course Details
              </p>
            </div>

            <div
              className={`hidden sm:block flex-1 h-[2px] max-w-[60px] ${currentStep > 2 ? "bg-emerald-300" : "bg-gray-200"}`}
            />

            {/* Step 3: Fees & Payment */}
            <div className="flex flex-col items-center sm:items-start gap-1 min-w-[70px]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${currentStep === 3 ? "bg-blue-600 text-white ring-4 ring-blue-50/80" : "bg-gray-200 text-gray-500"}`}
                >
                  3
                </span>
                <span
                  className={`hidden sm:inline text-xs font-semibold uppercase tracking-wider ${currentStep === 3 ? "text-blue-600" : "text-gray-500"}`}
                >
                  Step 3
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm font-semibold font-montserrat mt-1 ${currentStep === 3 ? "text-blue-700" : "text-gray-500"}`}
              >
                Fees & Payment
              </p>
            </div>
          </div>

          {/* Core Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0px_6px_30px_rgba(0,0,0,0.03)] w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* STEP 1: Student Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-montserrat tracking-tight">
                      Student Personal & Educational Details
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      Please provide personal and contact information to
                      complete your record.
                    </p>
                  </div>

                  {/* Read-Only Lead Details from Query Context */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        First Name
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {leadData?.lead?.firstName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Last Name
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {leadData?.lead?.lastName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Email Address
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {leadData?.lead?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Phone Number
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {leadData?.lead?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Male", "Female", "Other"].map((g) => (
                          <label
                            key={g}
                            className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-bold cursor-pointer transition ${selectedGender === g ? "border-blue-600 bg-blue-50/40 text-blue-700 ring-2 ring-blue-50" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                          >
                            <input
                              type="radio"
                              value={g}
                              {...register("gender")}
                              className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span>{g}</span>
                          </label>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register("dob")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
                      />
                      {errors.dob && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.dob.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Guardian Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Parent / Guardian Name"
                        {...register("guardianName")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
                      />
                      {errors.guardianName && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.guardianName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Guardian Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="Guardian Mobile Number"
                        {...register("guardianPhone")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
                      />
                      {errors.guardianPhone && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.guardianPhone.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Permanent Address{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Full physical address details"
                        {...register("address")}
                        className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 placeholder:font-normal"
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        College / Institution{" "}
                        {isCollegePreFilled && "(Read Only)"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="College Name"
                        readOnly={isCollegePreFilled}
                        {...register("collegeName")}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold transition focus:outline-none ${
                          isCollegePreFilled
                            ? "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
                        }`}
                      />
                      {errors.collegeName && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.collegeName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Educational Qualification{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("qualification")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium bg-white"
                      >
                        <option value="">Select Qualification</option>
                        {DEGREES_LIST.map((degree) => (
                          <option key={degree} value={degree}>
                            {degree}
                          </option>
                        ))}
                      </select>
                      {errors.qualification && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.qualification.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Year of Passing <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="YYYY"
                        {...register("yearOfPassing")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
                      />
                      {errors.yearOfPassing && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.yearOfPassing.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Course Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-montserrat tracking-tight">
                      Course Enrollment Details
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      This course selection has been pre-assigned securely from
                      the database.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Enrollment Program
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCourse?.title || "Choose a Program"}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none cursor-not-allowed font-semibold"
                      />
                      {/* Hidden form input to preserve courseId submission */}
                      <input type="hidden" {...register("courseId")} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Course Duration
                      </label>
                      <input
                        type="text"
                        readOnly
                        placeholder="Auto-populated"
                        {...register("duration")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Fee & Payment Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-montserrat tracking-tight">
                      Fees & Payment Details
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      Review fees, enrollment payment type, and balance due
                      dates.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-5 space-y-4">
                    <h3 className="text-xs font-bold text-[#1F077D] uppercase tracking-wider mb-2">
                      Course Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-semibold">
                      <div>
                        <p className="text-[10px] font-bold text-[#7668AF] uppercase tracking-wider mb-0.5">
                          Course Name
                        </p>
                        <p className="text-gray-800 font-bold">
                          {selectedCourse?.title || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#7668AF] uppercase tracking-wider mb-0.5">
                          Standard Course Price
                        </p>
                        <p className="text-gray-800 font-bold">
                          ₹ {selectedCourse?.price || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#7668AF] uppercase tracking-wider mb-0.5">
                          Duration
                        </p>
                        <p className="text-gray-800 font-bold">
                          {watch("duration") || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Total Course Fees (₹){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Total Fees"
                        {...register("totalFees")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
                      />
                      {errors.totalFees && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.totalFees.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Payment Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("paymentType")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium bg-white"
                      >
                        <option value="FULL">Full Payment</option>
                        <option value="PARTIAL">
                          Partial / Installment Payment
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Amount Paid (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Paid Amount"
                        {...register("feePaid")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
                      />
                      {errors.feePaid && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {errors.feePaid.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-2">
                        Payment Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("paymentMode")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium bg-white"
                      >
                        <option value="ONLINE">Online UPI / Card</option>
                        <option value="CASH">Cash Payment</option>
                        <option value="BANK_TRANSFER">
                          Bank Transfer / IMPS
                        </option>
                        <option value="CARD">Swipe Card</option>
                      </select>
                    </div>

                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100/50 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                          Remaining Balance Amount
                        </p>
                        <p
                          className={`text-lg font-bold ${balanceAmount > 0 ? "text-amber-600" : "text-emerald-600"}`}
                        >
                          ₹ {balanceAmount}
                        </p>
                      </div>

                      {watchPaymentType === "PARTIAL" && balanceAmount > 0 && (
                        <div>
                          <label className="block text-xs font-bold text-[#1F077D] uppercase tracking-wide mb-1.5">
                            Balance Due Date{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            {...register("nextDueDate")}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
                          />
                          {errors.nextDueDate && (
                            <p className="mt-1 text-xs font-semibold text-red-500">
                              {errors.nextDueDate.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Navigation Buttons */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between items-center select-none">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>←</span> Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold text-sm shadow-md bg-[linear-gradient(135deg,#4A31F4_20%,#422CD5_50%,#2160D6_75%,#3A9CFC_100%)] hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Next Step <span>→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold text-sm shadow-md bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {mutation.isPending
                      ? "Submitting Onboarding..."
                      : "Submit Onboarding ✓"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
