export const Menu = [
  {
    key: '1',
    text: 'Ticket',
    icon: 'ConfirmationNumber',
    children: [
      { key: '11', text: 'Ticket Request', url: '/dashboard/ticket' },
      { key: '12', text: 'Ticket Change Stat', url: '/dashboard/ticketreqstat' },
    ],
  },
  {
    key: '2',
    text: 'Master',
    icon: 'TurnedIn',
    children: [
      { key: '21', text: 'Vendor', url: '/dashboard/vendor' },
      { key: '22', text: 'Bank', url: '/dashboard/banks' },
    ],
  },
  {
    key: '3',
    text: 'Security Matrix',
    icon: 'SupervisedUserCircle',
    children: [
      { key: '31', text: 'User', url: '/dashboard/users' },
      { key: '32', text: 'Access Menu', url: '/dashboard/securitygroup' },
    ],
  },
];
