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
      await checkEnrollmentService();
      const formData = new FormData();

      formData.append("name", data.name);

      formData.append("phone", data.phone);

      formData.append("email", data.email);

      formData.append("patrol", data.patrol);

      formData.append("instrument", data.instrument);

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
      toast.error(err.response?.data?.message || (err.code === "ECONNABORTED" ? "Face recognition service did not respond. Restart the backend with npm run dev." : "Registration Failed"));

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
