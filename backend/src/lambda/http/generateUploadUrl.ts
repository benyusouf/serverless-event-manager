import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler}  from 'aws-lambda'
import { getSignedUrl , updateEventAttachmentUrl } from "../../services/EventService";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    console.log("Processing Event ", event);
    const eventId = event.pathParameters.eventId;

    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const URL = await getSignedUrl(eventId);

    const updateImage = await updateEventAttachmentUrl(eventId, jwtToken);

    console.log(updateImage);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            uploadUrl: URL,
        })
    };
};
