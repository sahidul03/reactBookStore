export default {
  items: [
    {
      name: 'Home',
      url: '/',
      icon: 'icon-home'
    },
    {
      name: 'Others',
      url: '/others',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Conversation',
          url: '/conversation',
          icon: 'fa fa-comment-o',
        },
        {
          name: 'Settings',
          url: '/settings',
          icon: 'icon-settings',
        }
      ],
    }
  ],
};
