import { MultiStepFormStep } from "@/components/MultiStepForm";
import { store } from "@/store";
import { addIngredient, setImage } from "@/store/slices/recipeSlice";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { StepDietPreference } from "../components/StepDietPreference";
import { StepIngredientsSelection } from "../components/StepIngredientsSelection";
import { StepScan } from "../components/StepScan";
import { StepTimePreference } from "../components/StepTimePreference";

const handlePickImage = async (useCamera: boolean) => {
  const dispatch = store.dispatch;
  const permissionResult = useCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    Alert.alert(
      "İzin Gerekli",
      "Ürünleri taramak için kamera veya galeri izni vermeniz gerekiyor.",
    );
    return;
  }

  const result = useCamera
    ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        // Use fullScreen to avoid PHPicker/PageSheet issues on iOS
        presentationStyle:
          ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      });

  if (!result.canceled) {
    dispatch(setImage(result.assets[0].uri));
  }
};
export const createFormSteps = ({
  dispatch,
  onScanImage,
}: {
  dispatch: any;
  onScanImage: () => void;
}): MultiStepFormStep[] => [
  {
    id: "scan",
    fields: [], // No validation needed for scan review
    shouldHandleNextStep: false,
    render: () => (
      <StepScan
        onNext={() => {
          onScanImage();
        }}
        onNewCapture={() => handlePickImage(true)}
        onPickFromGallery={() => handlePickImage(false)}
        direction="forward"
      />
    ),
  },
  {
    id: "ingredients",
    shouldHandleNextStep: true,
    fields: ["selectedIngredients"],
    render: ({ data, setValue, nextStep }) => (
      <StepIngredientsSelection
        onToggleIngredient={(ingredient) => {
          // Update form data as well
          const current = data.selectedIngredients || [];
          const updated = current.includes(ingredient)
            ? current.filter((i: string) => i !== ingredient)
            : [...current, ingredient];
          setValue("selectedIngredients", updated);
        }}
        onAddIngredient={(ingredient) => {
          const current = data.selectedIngredients || [];
          dispatch(addIngredient(ingredient));
          setValue("selectedIngredients", [...current, ingredient]);
        }}
        data={data}
        onNext={nextStep}
        direction="forward"
      />
    ),
  },
  {
    id: "time",
    shouldHandleNextStep: true,
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
    shouldHandleNextStep: true,
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
