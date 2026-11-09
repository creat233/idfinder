# Architecture rules

- Public MCard appointments use validated reservation functions and private storage, with date-scoped transaction locks to prevent overlapping bookings; never reserve by inserting a chat message alone.
- Appointment availability and confirmation require an online server response; offline forms may remain open but must never claim a slot is reserved.
- Exposed booking functions are security-invoker wrappers around narrowly scoped private-schema functions; visitors must never read other visitors' contact details.