# Virtual Radar
A Radar which displays all the aircrafts that are in transit in a given range. 
The project contains both client and server side.

## Prerequisites

* Node (to run the web service)

### To manage the database
Go to the **./server/conf** folder.
To create the database:
```
$ node createDatabase.js
```
To drop the database:
```
$ node dropDatabase.js
```
To clean existing tables of the database:
```
$ node deleteTables.js
```

### To run the web service
Go to the **./server/webservice** folder and run
```
$ node index.js
```

### Client side configuration
To change the IP address of the web service to get data from, go to the folder **./client/script/script.js** and edit the **WP_IP variable**
```javascript
WP_IP = "192.168.1.20";
```

#### Credits
* [AmCharts](https://www.amcharts.com/) 
* [Flaticon](https://www.flaticon.com/)



