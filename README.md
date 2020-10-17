# Gamifying and Socializing Teaching and Learning
**Academic Year 2019/2020 Semester 1**

**Project Background:** *(taken directly from provided requirements)*

The Teaching, Learning and Pedagogy Division (TLPD) of NTU is attempting to introduce a social game on mobile devices to gamify and socialize teaching and learning of software engineering courses. Students can learn and compete with each other via playing the game, and teachers can assess the mastery of course via data analysis.

Done by:

**Team Peach**
***

## Installation

* Clone this repository into a folder of your choice
```
git clone https://github.com/EOWD0001/CZ3003-Software-Systems-Design-and-Analysis.git
```
* Run the following command in the root folder
```
npm install
```
* CD into the client folder and run 'npm install' again
```
cd client
npm install
```

## Development

Run the following command to test your code in development environment
```
cd client
npm run serve
```

***

## Build - Deployment

We are using Firebase to host the web app so firstly you need access to the Firebase project.

You need to install Firebase CLI to perform the necessary deployment operations.

`npm install -g firebase-tools`

Once you are ready, login to Firebase with your Google account

`firebase login`

Change directory to *root*/client of the project i.e CZ3003-Software-Systems-Design-and-Analysis/client

Build the project,
`npm run build`

Next you can deploy to the server by typing the following command,
`firebase deploy --only hosting`

The settings are configured in firebase.json already so just go ahead and deploy. (you don't have to run `firebase init`)

Once the web app is deployed, you can see the updated version at *https://cz3003-assignment.firebaseapp.com*

## Running Unit Tests

Make sure you are in the `client` directory. If not `cd client` to change into the directory.

Run the command `npm run test`

Positive unit tests should return a message that says all tests passed

## References

| Resource | Used For | URL |
| -------- | -------- | --- |
| BootstrapVue | UI components, layout and responsive design | https://bootstrap-vue.js.org/ |
| Element | Component library based on Vue | https://element.eleme.io/#/en-US |
| Vue-Awesome | SVG icon component built for Vue using free Font Awesome icons | https://github.com/Justineo/vue-awesome |
| Font Awesome Icon Gallery | Font Awesome icon reference | https://fontawesome.com/icons?d=gallery |
