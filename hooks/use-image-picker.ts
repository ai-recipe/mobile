import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

interface UseImagePickerProps {
  onSuccess?: (uri: string) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export const useImagePicker = (hookOptions: UseImagePickerProps = {}) => {
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  const pickImage = async (
    useCamera: boolean,
    callOptions: UseImagePickerProps = {},
  ) => {
    const onSuccess = callOptions.onSuccess || hookOptions.onSuccess;
    const onError = callOptions.onError || hookOptions.onError;
    const onCancel = callOptions.onCancel || hookOptions.onCancel;

    if (useCamera) {
      setIsLoadingCamera(true);
    } else {
      setIsLoadingGallery(true);
    }

    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "İzin Gerekli",
          "Ürünleri taramak için kamera veya galeri izni vermeniz gerekiyor.",
        );
        onCancel?.();
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            quality: 0.8,
            allowsEditing: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            allowsEditing: true,
            presentationStyle:
              ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
          });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSuccess?.(result.assets[0].uri);
      } else {
        onCancel?.();
      }
    } catch (error) {
      console.log("ImagePicker Error:", error);
      onError?.(error);
    } finally {
      setIsLoadingCamera(false);
      setIsLoadingGallery(false);
    }
  };

  return {
    pickImage,
    isLoadingCamera,
    isLoadingGallery,
  };
};
