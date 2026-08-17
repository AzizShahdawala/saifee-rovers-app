import { useState } from "react";

import { toast } from "react-toastify";

import { checkEnrollmentService, registerMember } from "../services/memberService";

export default function useMemberForm() {
  const [loading, setLoading] = useState(false);

  const [capturedImages, setCapturedImages] = useState({});

  const [currentStep, setCurrentStep] = useState(0);

  const submitMember = async (data) => {
    setLoading(true);

    try {
      const imageCount = Object.keys(capturedImages).length;
      if (imageCount > 0 && imageCount !== 5) throw new Error("Complete all 5 face poses or remove them to register without enrollment");
      if (imageCount === 5) await checkEnrollmentService();
      const formData = new FormData();

      if (data.itsId) formData.append("itsId", data.itsId);

      formData.append("name", data.name);

      formData.append("phone", data.phone);

      formData.append("dateOfBirth", data.dateOfBirth);

      formData.append("joinedYear", String(data.joinedYear || 2020));

      formData.append("profession", data.profession);

      if (data.professionDetails) formData.append("professionDetails", data.professionDetails);

      formData.append("maritalStatus", data.maritalStatus);

      if (data.spouseName) formData.append("spouseName", data.spouseName);

      if (data.spouseDateOfBirth) formData.append("spouseDateOfBirth", data.spouseDateOfBirth);

      formData.append("children", JSON.stringify(data.children || []));

      formData.append("email", data.email);

      formData.append("patrol", data.patrol);

      if (data.instrument) formData.append("instrument", data.instrument);

      formData.append("isPatrolLeader", String(Boolean(data.isPatrolLeader)));

      for (const pose in capturedImages) {
        const blob = await fetch(capturedImages[pose]).then((r) => r.blob());

        formData.append(
          "images",

          blob,

          `${pose}.jpg`,
        );
      }

      await registerMember(formData);

      toast.success("Member Registered");

      setCapturedImages({});

      setCurrentStep(0);

      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || (err.code === "ECONNABORTED" ? "Face enrollment service did not respond. Restart the backend with npm run dev." : "Registration Failed"));

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitMember,
    capturedImages,
    setCapturedImages,
    currentStep,
    setCurrentStep,
  };
}
