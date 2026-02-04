import { MultiStepFormStep } from "@/components/MultiStepForm";
import { useRouter } from "expo-router";
import { StepDietPreference } from "../components/StepDietPreference";
import { StepScan } from "../components/StepScan";
import { StepTimePreference } from "../components/StepTimePreference";

export const createFormSteps = ({
  formData,
  router,
}: {
  formData: any;
  router: ReturnType<typeof useRouter>;
}): MultiStepFormStep[] => [
  {
    id: "scan",

    fields: [], // No validation needed for scan review, it's just display + actions
    render: ({ nextStep }) => (
      <StepScan
        imageUri={formData.image}
        onNext={nextStep}
        onNewCapture={() => router.back()}
        onPickFromGallery={() => router.back()}
        direction="forward"
      />
    ),
  },
  {
    id: "time",
    fields: ["timePreference"],
    render: ({ data, setValue, nextStep }) => (
      <StepTimePreference
        value={data.timePreference}
        onChange={(v) => setValue("timePreference", v)}
        onNext={nextStep}
        direction="forward"
      />
    ),
  },
  {
    id: "diet",

    fields: ["dietPreferences"],
    render: ({ data, setValue, nextStep }) => (
      <StepDietPreference
        value={data.dietPreferences || []}
        onChange={(v) => setValue("dietPreferences", v)}
        onSubmit={nextStep}
        direction="forward"
      />
    ),
  },
];
