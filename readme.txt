---------------
PROJECT TITLE
---------------
The online xml based converter.


---------------
OVERVIEW
---------------
This dockerized project is used to demonstrate a online convertion by reading xml file containing conversion rates 
and extracting matching keys from it. 
It updates the xml file on startup.

-------------------
GENERAL USAGE NOTES
-------------------

- The reference date must be inserted in the range of the dates available in xml file.

- To and from curencies should not be equal

- Inserted amount should not be negative 


-------------------
Prerequisites
-------------------

NodeJS


-----------------------
Installation and usage
-----------------------

to clone the project use: 

 - git clone https://github.com/mknoori4470/projects.git

The package.json files is already updated. To install dependencies in the application root in CMD, run npm install.

Run node index.js file in application directory in command prompt or windows powershell 
This aplication listens to port 3000 so it should run like this in browser: 

    localhost:3000

------------------------------
GIT and Docker ripositories
------------------------------

project in git repository:
  - https://github.com/mknoori4470/projects.git


docker image 
  - mknoori4470/node-convert-app