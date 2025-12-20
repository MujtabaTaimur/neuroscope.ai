/*
 * NeuroScope Static Auth Config
 *
 * GitHub Pages cannot run a server, so this login is a UI gate only.
 * Anyone can bypass it by editing client-side JS. Do not use this to protect paid content.
 *
 * To change the password:
 * 1) Open /Pages/Login.html in the browser.
 * 2) Open DevTools Console and run:
 *      await NeuroScopeAuth.dev.makeUserRecord('your-username', 'your-new-password', 'admin')
 *    Copy the returned object into NS_AUTH_USERS below.
 */

// eslint-disable-next-line no-unused-vars
window.NS_AUTH_USERS = window.NS_AUTH_USERS || [
  // Default demo user.
  // Username: admin
  // Password: admin
  // Replace this record for anything beyond a demo.
  {
    username: 'admin',
    role: 'admin',
    iterations: 200000,
    salt_b64: 'q0lL7olSqvVg4dN70O4+RQ==',
    hash_b64: 'kUVF13mJYdMnUdfMLKSsvUFcy6C01FGtI+oLfN84yt4='
  }
];
