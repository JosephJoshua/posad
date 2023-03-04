/**
 * @see https://firebase.google.com/docs/cloud-messaging/js/receive#setting_notification_options_in_the_service_worker
 */

importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);

importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyD9gRTS4ogqkDA98AwCKpt4x6wp-OHXz_A',
  authDomain: 'posad-8e52c.firebaseapp.com',
  projectId: 'posad-8e52c',
  storageBucket: 'posad-8e52c.appspot.com',
  messagingSenderId: '525331637697',
  appId: '1:525331637697:web:2b2a4ddae6a4435dadbb40',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
