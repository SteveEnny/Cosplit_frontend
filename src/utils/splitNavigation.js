export const navigateToSplit = (navigate, data) => {
  if (!data?.id) {
    console.warn("Missing split ID in navigation response");
  }

  navigate("/dashboard/success", {
    state: {
      splitId: data.id || null,
    },
  });
};
