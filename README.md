# FriendZoneServer
Built with nodejs, express, sequelize and mariadb.
Running in AWS ECS with docker compose.

API Documentation

| Endpoint | Params | Description |
| --- | --- | --- |
| POST /api/user | null | List all users |
| POST /api/user/addFriend | {  friends: [ 'Harvey.Lynch@gmail.com', 'Cecilia_Wiegand80@hotmail.com' ] } | Establish friends connection |
| POST /api/user/findFriends | {  email: 'Harvey.Lynch@gmail.com' } | Find friends by email |
| POST /api/user/commonFriends | {  email: [ 'Harvey.Lynch@gmail.com', 'Cecilia_Wiegand80@hotmail.com' ] } | Find common friends between two emails |
| POST /api/user/subscribe | { requestor: 'Harvey.Lynch@gmail.com', target: 'Cecilia_Wiegand80@hotmail.com'  } | Subscribe to user |
| POST /api/user/blockUser | { requestor: 'Harvey.Lynch@gmail.com', target: 'Cecilia_Wiegand80@hotmail.com'  } | Block user |
| POST /api/user/findRecipients | { sender: 'Harvey.Lynch@gmail.com', text: 'hello Cecilia_Wiegand80@hotmail.com'  } | Find users that is able to receive updates |

