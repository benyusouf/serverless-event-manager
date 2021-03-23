import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import { getEvent } from "../../services/EventService";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log("Processing Event ", event);

    console.log(event.pathParameters);

    const eventId = event.queryStringParameters.eventId;
    const userId = event.queryStringParameters.userId;

    const events = await getEvent(eventId, userId);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "items": events,
        }),
    }
};
