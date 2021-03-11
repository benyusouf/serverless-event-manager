import * as AWS from "aws-sdk";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {Types} from 'aws-sdk/clients/s3';
import { EventItem } from "../models/EventItem";
import { EventUpdate } from "../models/EventUpdate";

import * as AWSXRay from "aws-xray-sdk"; 
import { SaveEventRequest } from "../requests/SaveEventRequest";

const XAWS = AWSXRay.captureAWS(AWS);

export class EventRepository {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new AWS.S3({signatureVersion: 'v4'}),
        private readonly eventTable = process.env.EVENTS_TABLE,
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getUserEvents(userId: string): Promise<EventItem[]> {
        console.log('Getting all user events');

        const params = {
            TableName: this.eventTable,
            KeyConditionExpression: '#userId = :userId',
            ExpressionAttributeNames: {
                '#userId': 'userId'
            },
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };

        const result = await this.docClient.query(params).promise();
        console.log(result);
        const items = result.Items;

        return items as EventItem[]
    }

    async getEvents(): Promise<EventItem[]> {
        console.log('Getting all events');

        const params = {
            TableName: this.eventTable
        };

        const result = await this.docClient.query(params).promise();
        console.log(result);
        const items = result.Items;

        return items as EventItem[]
    }

    async createEvent(event: EventItem): Promise<EventItem> {
        console.log('Creating new event');

        const params = {
            TableName: this.eventTable,
            Item: event
        };

        const result = await this.docClient.put(params).promise();
        console.log(result);

        return event as EventItem;
    }

    async updateEvent(eventUpdate: SaveEventRequest, eventId: string, userId: string): Promise<EventUpdate> {
        console.log('Updating event');

        const params = {
            TableName: this.eventTable,
            Key: {
                'userId': userId,
                'id': eventId
            },
            UpdateExpression: 'set #a = :a, #b = :b, #c = :c, #d = :d',
            ExpressionAttributeNames: {
                '#a': 'title',
                '#b': 'scheduleddAt',
                '#c': 'done',
                '#d': 'eventType'
            },
            ExpressionAttributeValues: {
                ':a': eventUpdate['title'],
                ':b': eventUpdate['scheduleddAt'],
                ':c': eventUpdate['done'],
                ':d': eventUpdate['eventType']
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await this.docClient.update(params).promise();
        console.log(result);
        const attributes = result.Attributes;

        return attributes as EventUpdate;
    }

    async deleteEvent(eventId: string, userId: string): Promise<string> {
        console.log('Deleting event');

        const params = {
            TableName: this.eventTable,
            Key: {
                'userId': userId,
                'id': eventId
            },
        };

        const result = await this.docClient.delete(params).promise();
        console.log(result);

        return '' as string;
    }

    async getSignedUrl(eventId: string): Promise<string> {
        console.log('Generating URL');

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: `${eventId}.png`,
            Expires: 1000,
        });
        console.log(url);

        return url as string;
    }

    async updateEventAttachmentUrl(eventId: string, userId: string): Promise<string> {

        console.log('Updating event attachment url');

        const params = {
            TableName: this.eventTable,
            Key: {
                'userId': userId,
                'id': eventId
            },
            UpdateExpression: 'set #a = :a',
            ExpressionAttributeNames: {
                '#a': 'attachmentUrl'
            },
            ExpressionAttributeValues: {
                ':a': `https://${process.env.S3_BUCKET_NAME}.s3-us-west-2.amazonaws.com/${eventId}.png`
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await this.docClient.update(params).promise();
        console.log(result);

        return '' as string;
    }
}