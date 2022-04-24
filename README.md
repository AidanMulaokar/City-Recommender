City Recommender
CS6242 Group 33
Members: Aidan Mulaokar, Jacob Swain, Joshua Hsu, Dimitri Adhikary

ACCESSING PROJECT -

Remote Access

Our project is available for use at https://shielded-wave-14550.herokuapp.com/ , however, this version contains a limited catboost regressor model due to the request time required for our full version. Unfortunately setting up a pinging system for the Heroku servers which are hosting our site proved to be a bit challenging so in order to provide a fully functioning demo we had to sacrifice some of our assumed accuracy.

Local Access

To access and run our code locally you can either download a zip of the project repo or clone it to your machine.

PREREQUISITES -

In order to run the project locally you must have installed the following:
Node.js >17
Python version >3.6
Google Chrome (recommended)

SETUP -

The recommended way of using the project is to first open two terminals on your machine.

Frontend

In one terminal, navigate to the root "City-Recommender" folder of our repo. This will be the terminal that will act as the client and track the frontend of the project. From here run the command "npm install" this uses npm (Node Package Manager) to install all of the required project dependencies onto your machine. These can be uninstalled at a later time using "npm uninstall <package name>". If there are any issues installing the dependencies and you would like to continue trying to run the project on your machine, run "npm install --force" which will remove system protections and force your computer to update. Warning: we do not know if there are any risks with this method, but as of our research and useage ourselves we can only attest to not encountering any issues as of now. Once the packages are successfully installed run "npm start". You should receive a startup message in the terminal and if you open a browser and navigate to "http://localhost:3000" you should see the initial screen of our project. Please do not try using the application at this time if you have not completed the Backend Steup.

Backend
  
In the other terminal navigate to the root folder "City-Recommender" and then into the "server" folder. From here you will need to run the following commands to install required python libraries :
(keep in mind the usage is "pip" for windows and "pip3" for mac)

pip install catboost
pip install flask
pip install flask_cors
pip install pymongo
pip install "pymongo[srv]"

_NOTE_ While pymongo is not an active library in our project there are commented provisions to use pymongo connections and therefore if you would like to test out our mongo connections we recommend installing this library. The connection will not be valid since we are not including the password to our database so please let us know if you would like our access credentials.

Once all of these installations have finished, run "python server.py" ("python3 server.py" if on mac). You should see a message similar to:

- Restarting with stat
- Debugger is active!
- Debugger PIN: 608-458-836

Now your server is set up and you can begin using the project!

PROJECT USAGE
  
There is a more detailed description found in our report about the project itself, but the basic usage is as follows. The initial screen displayes a choropleth map of previous recommendations we have given on a state to state basis. These totals will be displayed upon hovering over the state labels. On the right side you will notice a progressive form that you can fill out to then receive results on our recommendations for you. All fields of the form are technically optional, but we users will receive higher quality results the more fields that they accurately complete. The results will be displayed on a rerendered map in the form of clickable markers with the drilldown of contributing factors presented on the right side of the screen and the top 5 factors that specifically contributed to the rating for you and their exact values as tooltips upon hovering over each marker.
