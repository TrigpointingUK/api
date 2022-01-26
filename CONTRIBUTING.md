# Contributing to the TrigpointingUK codebase

This project is currently in its early stages, prompted by the anticipated loss of the AWS infrastructure on which the old php-based codebase runs.

The new architecture is hopefully more modular, and more secure.  All accesses to the database will be made via the api (written in nestjs).
The public webpage will be written in Vue.js and consume this API, using authentication tokens provided by Auth0.

The initial challenge is to get an MVP working, which eases, as far as possible, the user experience transitioning to the new authentication system.
(Annoyingly, Auth0 does not support imported data from php's crypt function).

Contributions from the community are welcome.  In the initial stages, anyone who could look at ways of providing a forum / wiki which uses the
new Auth0 authentication, and ideally migrates in all the existing data from the old website, would be most welcome!  Eventually, once a robust
API is in place, there will be more opportunity for contributions of core code, or even offshoots similar to TrigTools.
