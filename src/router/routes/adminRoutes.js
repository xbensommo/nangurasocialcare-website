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
      component: lazy('Dashboard', 'admin'),
      meta: {"title":"Panel"}
    },

    { 
      path: 'manage/session', 
      name: 'Manage Session', 
      component: lazy('ManageSession', 'admin'),
      meta: {"title":"Manage a  Session"}
    },

        { 
      path: 'user/view/:userId/users', 
      name: 'User Profile', 
      component: lazy('ClientProfile', 'admin'),
      meta: {"title":"Client Profile Page"}
    },

    { 
      path: 'sessions/:id/view', 
      name: 'Selected Session', 
      component: lazy('SelectedSession', 'admin'),
      meta: {"title":"Selected Session"}
    },

    { 
      path: 'users', 
      name: 'Clients', 
      component: lazy('Clients', 'admin'),
      meta: {"title":"Clients"}
    },

    { 
      path: 'sessions', 
      name: 'Sessions', 
      component: lazy('Sessions', 'admin'),
      meta: {"title":"Session"}
    },

    { 
      path: 'schedule', 
      name: 'My Schedule', 
      component: lazy('AdminSchedule', 'admin'),
      meta: {"title":"Dashboard"}
    }
    
  ]
  
});