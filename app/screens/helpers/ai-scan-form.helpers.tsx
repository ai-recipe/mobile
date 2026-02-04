import { MultiStepFormStep } from "@/components/MultiStepForm";
import { useRouter } from "expo-router";
import { StepDietPreference } from "../components/StepDietPreference";
import { StepIngredientsSelection } from "../components/StepIngredientsSelection";
import { StepScan } from "../components/StepScan";
import { StepTimePreference } from "../components/StepTimePreference";

export const createFormSteps = ({
  formData,
  router,
  scannedIngredients,
  onScanImage,
  onToggleIngredient,
  onAddIngredient,
}: {
  formData: any;
  router: ReturnType<typeof useRouter>;
  scannedIngredients: string[];
  onScanImage: () => void;
  onToggleIngredient: (ingredient: string) => void;
  onAddIngredient: (ingredient: string) => void;
}): MultiStepFormStep[] => [
  {
    id: "scan",
    fields: [], // No validation needed for scan review
    render: () => (
      <StepScan
        imageUri={formData.image}
        onNext={() => {
          onScanImage();
        }}
        onNewCapture={() => router.back()}
        onPickFromGallery={() => router.back()}
        direction="forward"
      />
    ),
  },
  {
    id: "ingredients",
    fields: ["selectedIngredients"],
    render: ({ data, setValue, nextStep }) => (
      <StepIngredientsSelection
        ingredients={scannedIngredients}
        selectedIngredients={data.selectedIngredients || []}
        onToggleIngredient={(ingredient) => {
          onToggleIngredient(ingredient);
          // Update form data as well
          const current = data.selectedIngredients || [];
          const updated = current.includes(ingredient)
            ? current.filter((i: string) => i !== ingredient)
            : [...current, ingredient];
          setValue("selectedIngredients", updated);
        }}
        onAddIngredient={(ingredient) => {
          onAddIngredient(ingredient);
          const current = data.selectedIngredients || [];
          setValue("selectedIngredients", [...current, ingredient]);
        }}
        onNext={nextStep}
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
