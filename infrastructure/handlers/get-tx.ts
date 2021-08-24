import { ApiGatewayManagementApi } from 'aws-sdk';
import { v4 as uuidV4 } from 'uuid';

interface DataResponse {
  callbackUrl: string;
  connectionId: string;
  txId: string;
}

const txIds = [...new Array(40)].map(() => uuidV4());

function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export const getTxHandler = async function (event: any) {
  const connectionId = event.requestContext.connectionId;
  const callbackUrl = event.requestContext.domainName + '/' + event.requestContext.stage;
  const response: DataResponse = {
    callbackUrl,
    connectionId,
    txId: '',
  };

  const apigwManagementApi = new ApiGatewayManagementApi({
    endpoint: callbackUrl,
  });

  for (const id of txIds) {
    await apigwManagementApi
      .postToConnection({ ConnectionId: connectionId, Data: JSON.stringify({ ...response, txId: id }) })
      .promise();

    await wait(1000);
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  };
};
