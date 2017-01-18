/**
 * Created by eugenia on 22.09.16.
 */

export const config = {
  appTitle: 'Електронна бібіліотека',
  errors: {
    email: {
      required: "Email обов'язковий!",
      invalid: 'Email неправильний!'
    },
    password: {
      required: "Пароль обов'язковий!",
      invalid: 'Пароль неправильний!'
    }
  },
  notificationTypes: {
    error: 'error',
    success: 'success',
    info: 'info',
    warning: 'warning'
  },
  backendUrl: /*process.env.REACT_APP_BACKEND_URL ||*/ 'http://localhost:1340',
  backendBasePath: 'api',
  auth: {
    path: 'oauth',
    clientId: process.env.REACT_APP_CLIENT_ID || 'default',
    clientSecret: process.env.REACT_APP_CLIENT_SECRET || 'default'
  },
  resources: {
    users: 'users',
    requests: 'requests',
    authors: 'authors',
    publications: 'publications'
  },
  request: {
    statuses: {
      PENDING: 'pending',
      APPROVED: 'approved',
      REJECTED: 'rejected'
    }
  },
  roles: {
    USER: 'user',
    ADMIN: 'admin'
  }
};