# Serverless EVENT MANAGER

This project is implemented using AWS Lambda, Serverless Framwork for NodeJs and Angular

## Functionality of the application

This application allows users to create, view, book, update and delete events. Each event item is attached a random placeholder image at the time of creation, event owner can also update the image there after. The app contains two tab the first tab displays all events in the system and allow users to view and register for an event while the second tab display events owned by the logged in user.

## Backend

The `backend` folder in the root directory contains the backend project written in NodeJs using AWS Lambda, DynamoDb and Serverless Framework.


To deploy the application to AWS Lambda you need to have NodeJs, NPM, AWS CLI and Serverless Framework installed then run the following commands:

```
cd backend
npm install
sls deploy -v
```

If Serverless Framework complains not seeing your AWS profile, please run this command instead

```
sls deploy -v --aws-profile your-profile
```

## Frontend

The `client` folder in the root directory contains a web application written using Angular Framework, this application consumes the API developed and hosted on AWS API Gateway service backed by AWS Lambda.

You should make the following changes to link the client application with the API.

You first need to create an application on Auth0, get your domain and clientId then open `config.json` file and input the values in `domain` and `clientId` properties of the json object respectively.

You also need to get your API Gateway URL and pass it to the `api` property of the json object

```json
  {
    "domain": "",
    "clientId": "",
    "api": ""
  }
```

To run a client application you need to have NodeJs, NPM and Angular CLI installed then run the following commands:

```
cd client
npm install
ng serve
```

This should start a development server for the Angular application that interact with the serverless application.
