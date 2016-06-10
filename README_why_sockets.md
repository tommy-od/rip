Benefits of Websockets 
- Uses TCP
 _ Unlike AJAX or iframe, which use HTTP, websockets uses TCP connection to open and close connections. 
 _ This means the client doesn't have to send the ~64 cookies with every single AJAX call.
 _ Client also doesn't send entire list of header information, provisions, etc.

Websockets > iFrame
- No duplicated code (javascript & CSS)
 _ An iframe requires a separate project, separate code-base, hence all of the global CSS and javascript needs that is 
used in the iframe needs to be coded again. 
 _ That duplicated code will also need to be kept up with respect to the style guide (...haven't had great luck with that
thus far)
 
- No more worry about cross-origin domain policies!!!
 _ The biggest pain in working with iFrames is the CORS issues when communicating to and from the iFrames parent. 
Websockets eliminate this issue, as no 'document.domain' needs to be worried about. Message origin still needs to be 
considered to make sure unexpected clients aren't connecting to our server.

- The JS code for iFrame communication can be re-used for Websockets
 _ Comparing this websockets code with the My Files JS code you can see that the messaging events are identical, hence 
the idea behind the code can be re-used.
 _ To move forward with iFrame solution just because we are already comfortable with it can put to rest knowing that 
the difficult part of the code (back and forth communication) is essentially the same. 


iFrame > Websockets
- IE9 and less support (but there are plugins to polyfill)

Further Information:
- Websocket packet and general info: https://tools.ietf.org/html/rfc6455#section-5.2
- Get info on all open socket connections: chrome://net-internals/#sockets
- CDT Network tab -> WS/websockets will show off the client/server connections, length of packets (in bytes) and 
timestamps (localhost is RTT 3ms-5ms consistently)