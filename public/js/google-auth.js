// Keep provider setup separate so it can be checked without real credentials.
export async function startGoogleSignIn(sdk, auth) {
  const provider = new sdk.GoogleAuthProvider();
  provider.setCustomParameters({prompt: 'select_account'});
  // Called directly from a click; no extra Gmail, contacts, or Drive scopes.
  const result = await sdk.signInWithPopup(auth, provider);
  return {user: result.user, isNewUser: !!sdk.getAdditionalUserInfo(result)?.isNewUser};
}
