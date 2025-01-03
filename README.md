
### Twitch Stream Dashboard

This is a Code-Showcase for my résumé and not intended for use by anyone. It was used by the livestreamer Jerma985 as a dashboard to track events in his livestream relating to donations, donation messages and Twitch Raids. The dashboard itself connects to the stream events via IRC to show new events live. A chat bot running on a server provides data to a MySQL database, which is used to load previous events. You can see the code in action at [jerma.org/mustard](https://jerma.org/mustard).

This only includes the front end and no code on the server or of the chat bot on the server. This project runs with JavaScript, Node.js and some PHP (of course HTML and CSS as well). It doesn't use any framework and everything, including the IRC chat bot is written by myself.

In the following screenshot you can see several different elements. There is a statistics window which updates automatically as new data comes in, a settings window using localStorage to save settings and a restore window which shows stream events from a previous stream.
![Screenshot of the Dashboard with several different Windows open.](/jerma.org_mustard.png)
