# c02-fossil-fuel-by-nation-api

Gofore's  preliminary assignments. Application's goal is to parse given CSV (/data/fossil-fuel-co2-emissions-eviled-1.csv) file and create API that can query it with parameters from, to, type and top. Some of the CSV's lines are corrupted and should be ignored.

## How to improve assigment
***
Current way of thinking years is assingning them to a array with indexes (year 1950 is index 1950). Another good way of doing this would have been to use objects. Object's key could have been assigned to year and it's value that year's records. That would atleast give chance the year to have some other data with the year's polluters (for example average pollution amount).

Another way of improving the would have been to implement pollutersApi's data processing functions to different files so they could be more easily used. Also depending on how much more API end points and functions there would be in the future, worst api could have been also dispersed to it's own file.

CSV could have been parsed using some library but I decided that I wanted to parse the CSV on my own. I would have brought minimal advantage if none.

## How to run
***
Project requires installation of Node and NPM. (https://nodejs.org/)

After Node and NPM have been installed run following command in project folder
``` 
npm install
```

To start application run following command
```
node app
```

To run automated tests 
```
npm test
```