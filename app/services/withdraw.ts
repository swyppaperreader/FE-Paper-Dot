export const withdraw = async (socialType: string) => {
  await fetch(`https://be-paper-dot.store/auth/withdraw/${socialType}`, {
    method: "DELETE",
  });
};
