import apiClient from "@/lib/axios";

// Uploads a file to the server and returns the file URL
// folderParam := r.FormValue("folder") - backend
// e.g., "shops", "products", "profiles", etc.
export async function uploadFile(file: File, folder: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    console.log("Uploading file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const response = await apiClient.post<{ url: string }>(
      "/uploads/file",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Upload successful:", response.data.url);
    return response.data.url;
  } catch (error: any) {
    console.error("Upload error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Failed to upload file");
  }
}
