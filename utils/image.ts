import * as ImageManipulator from "expo-image-manipulator";

export const compressImage = async (uri: string, quality = 0.7) => {
  try {
    const result = await ImageManipulator.manipulateAsync(uri, [], {
      compress: quality,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return result.uri;
  } catch (error) {
    console.error("Image compression failed:", error);
    return uri; // Return original if compression fails
  }
};

export const resizeImage = async (
  uri: string,
  width: number,
  height: number
) => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width, height } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error("Image resizing failed:", error);
    return uri;
  }
};
