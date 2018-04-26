 # Human Development Index
 
 ## Interactive Data Visualisation Web Application
 This Web App was built as the second project for the Code Institute's classroom bootcamp. It is a Data Visualisation project using Pythons Flask framework.
 
 ## Live Demo
**Follow this link to view deployed version of the web app** <https://hdi-dashboard.herokuapp.com/>

## Built with 

1. Flask
1. Python
3. HTML
4. CSS
5. Bootstrap
6. MongoDB database
7. JavaScript Libraries:
    - d3.js
    - dc.js
    - crossfilter.js
    - queue.js
8. The dataset was obtained [here](https://www.kaggle.com/sudhirnl7/human-development-index-hdi/data). 


## Components

### Flask
A Python micro-framework that was used to serve the data and render the HTML pages for this Application

### Python
A Python file name threatened_species.py renders a graphs.html template and builds a web server using pymongo to interact with MongoDB

### MongoDB database
NoSQL database that converts and presents data in JSON format. The dataset resource was downloaded as a csv file from here - it had many rows of aggregate data i.e. one row that was the product of three other rows, so it was cleaned and sorted in RoboMongo before being used.

### Queue.js
An asynchronour helper library for JavaScript

### Crossfilter.js
A Javascript based data manipulation library that enables two way data binding - you will see this in action when a section of a graph is clicked, all the other graphs filter

### D3.js
A JavaScript based visualisation engine that renders interactive charts and graphs in svg format when given data, which are then passed in to divs in graphs.html

### Dc.js
A Javascript based wrapper library for d3.js - this made plotting the charts easier

### CSS3
This dashboard offers a better experience on desktop and larger size screens however care was given to optimize the mobile experience as much as possible. 

A number of charts have a responsive width: 
```
width(document.getElementById('lowest_10_countries').clientWidth)
```

I've also included css which rotates the axis labels to enhance this style adjustment. 

```
#average_income_by_continent .x.axis text {
   text-anchor: end !important;
   transform: rotate(-60deg);
}
```

## Tests

Tested on different devices and screen sizes. I also manually calculated a random selection of expected scores within the `#countrySection`  to test the accuracy of the results returned. All scores returned via the graphs were correct and I am confident regarding data accuracy. 

## Hosting
Heroku is used to host this app. The requirements.txt contains all the packages required to run the app. The Procfile communicates to Heroku how to run the app. The server used for hosting is mLab MongoDB.



