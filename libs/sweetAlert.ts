/** Simple alert utility for displaying error messages */
export async function sweetMixinErrorAlert(message: string): Promise<void> {
  if (typeof window !== "undefined") {
    // For now, use browser's native alert
    // TODO: Replace with a proper toast/notification library (e.g., react-hot-toast, notistack)
    alert(message);
  }
}

export async function sweetTopSmallSuccessAlert(message: string): Promise<void> {
  if (typeof window !== "undefined") {
    alert(message);
  }
}
