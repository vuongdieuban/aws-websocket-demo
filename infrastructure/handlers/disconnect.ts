export const disconnectHandler = async function (event: any) {
  const response = {
    data: 'Socket Disconnected',
    connectionId: event.requestContext.connectionId,
  };
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  };
};
