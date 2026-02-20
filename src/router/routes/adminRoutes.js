// @src/router/routes/adminRoutes.js

export const adminRoutes = (lazy) => ({
  path: '/pra',
  component: lazy('AdminLayout', 'admin'),
  
  meta: {
    requiresAuth: true,
    roles: [
      "admin"
    ],
    "icon": "fa fa-cogs"
  },
  
  children: [
    
    { 
      path: '', 
      name: 'AdminControl', 
      component: lazy('QuickLog', 'admin'),
      meta: {"title":"Panel"}
    },

    { 
      path: 'bookings', 
      name: 'Booked Session', 
      component: lazy('QuickLog', 'admin'),
      meta: {"title":"Booke Session"}
    },

    { 
      path: 'users', 
      name: 'Clients', 
      component: lazy('Clients', 'admin'),
      meta: {"title":"Clients"}
    },

    { 
      path: 'schedule', 
      name: 'My Schedule', 
      component: lazy('AdminSchedule', 'admin'),
      meta: {"title":"Dashboard"}
    },
    
    /*{ 
      path: 'settings', 
      name: 'SystemSettings', 
      component: lazy('SystemSettings', 'admin')
    },
    
    { 
      path: 'users', 
      name: 'UserManagement', 
      component: lazy('UserList', 'admin/users')
    },
    
    { 
      path: 'users', 
      name: 'UsersList', 
      component: lazy('List', 'users'),
      meta: {"title":"Users Manager"}
    },
    
    { 
      path: 'users/create', 
      name: 'UsersCreate', 
      component: lazy('Create', 'users')
    },
    
    { 
      path: 'users/edit/:id', 
      name: 'UsersEdit', 
      component: lazy('Edit', 'users'),
      props: true
    },
    
    { 
      path: 'sessions', 
      name: 'SessionsList', 
      component: lazy('List', 'sessions'),
      meta: {"title":"Sessions Manager"}
    },
    
    { 
      path: 'sessions/create', 
      name: 'SessionsCreate', 
      component: lazy('Create', 'sessions')
    },
    
    { 
      path: 'sessions/edit/:id', 
      name: 'SessionsEdit', 
      component: lazy('Edit', 'sessions'),
      props: true
    },
    
    { 
      path: 'notes', 
      name: 'NotesList', 
      component: lazy('List', 'notes'),
      meta: {"title":"Notes Manager"}
    },
    
    { 
      path: 'notes/create', 
      name: 'NotesCreate', 
      component: lazy('Create', 'notes')
    },
    
    { 
      path: 'notes/edit/:id', 
      name: 'NotesEdit', 
      component: lazy('Edit', 'notes'),
      props: true
    },
    
    { 
      path: 'activitylogs', 
      name: 'ActivitylogsList', 
      component: lazy('List', 'activitylogs'),
      meta: {"title":"Activitylogs Manager"}
    },
    
    { 
      path: 'activitylogs/create', 
      name: 'ActivitylogsCreate', 
      component: lazy('Create', 'activitylogs')
    },
    
    { 
      path: 'activitylogs/edit/:id', 
      name: 'ActivitylogsEdit', 
      component: lazy('Edit', 'activitylogs'),
      props: true
    },
    
    { 
      path: 'slots', 
      name: 'SlotsList', 
      component: lazy('List', 'slots'),
      meta: {"title":"Slots Manager"}
    },
    
    { 
      path: 'slots/create', 
      name: 'SlotsCreate', 
      component: lazy('Create', 'slots')
    },
    
    { 
      path: 'slots/edit/:id', 
      name: 'SlotsEdit', 
      component: lazy('Edit', 'slots'),
      props: true
    },
    
    { 
      path: 'notifications', 
      name: 'NotificationsList', 
      component: lazy('List', 'notifications'),
      meta: {"title":"Notifications Manager"}
    },
    
    { 
      path: 'notifications/create', 
      name: 'NotificationsCreate', 
      component: lazy('Create', 'notifications')
    },
    
    { 
      path: 'notifications/edit/:id', 
      name: 'NotificationsEdit', 
      component: lazy('Edit', 'notifications'),
      props: true
    },*/
    
  ]
  
});