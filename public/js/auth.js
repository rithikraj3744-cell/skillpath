let sdk,auth;
export async function initAuth(config,callback){
 const [app,authSDK]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')]);
 sdk=authSDK;auth=sdk.getAuth(app.initializeApp(config));await sdk.setPersistence(auth,sdk.browserLocalPersistence);sdk.onAuthStateChanged(auth,callback);
}
export const getUser=()=>auth?.currentUser||null;
export const getToken=async()=>auth?.currentUser?auth.currentUser.getIdToken():null;
export async function login(email,password){return sdk.signInWithEmailAndPassword(auth,email,password);}
export async function register(name,email,password){const result=await sdk.createUserWithEmailAndPassword(auth,email,password);await sdk.updateProfile(result.user,{displayName:name});return result;}
export const logout=()=>sdk.signOut(auth);
export const resetPassword=email=>sdk.sendPasswordResetEmail(auth,email);
export function authError(error){const messages={'auth/invalid-credential':'Email or password is incorrect.','auth/email-already-in-use':'This email is already registered. Please sign in.','auth/weak-password':'Use at least 8 characters for your password.','auth/invalid-email':'Enter a valid email address.','auth/too-many-requests':'Too many attempts. Please wait and try again.','auth/network-request-failed':'Unable to connect. Check your internet connection.','auth/operation-not-allowed':'Email/password sign-in is not enabled in Firebase.','auth/unauthorized-domain':'Add this website domain to Firebase Authentication’s authorized domains.'};return messages[error.code]||error.message||'Unable to sign in. Try again.';}
