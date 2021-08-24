import { ApiGatewayManagementApi } from 'aws-sdk';

export const getTxHandler = async function (event: any) {
  const connectionId = event.requestContext.connectionId;
  const callbackUrl = event.requestContext.domainName + '/' + event.requestContext.stage;
  const response = {
    callbackUrl,
    connectionId,
    data: 'Starting from the bottom now we here',
  };

  const apigwManagementApi = new ApiGatewayManagementApi({
    endpoint: callbackUrl,
  });

  await apigwManagementApi
    .postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) })
    .promise()
    .catch(err => {
      console.error('--ERROR---', err);
      throw err;
    });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  };
};
