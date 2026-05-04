// ضع بيانات مشروع Firebase هنا عند إنشاء المشروع.
// المصدر الرسمي الحالي يستخدم Firebase Web modular SDK و initializeApp + getFirestore.
// اترك enabled=false ليعمل الموقع محليا بدون إنترنت أو بدون مشروع Firebase.

window.lifeOSFirebase = {
  enabled: false,
  collection: "life_os_users",
  config: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
