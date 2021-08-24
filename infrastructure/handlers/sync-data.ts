import { v4 as uuidV4 } from 'uuid';

const txIds = [...new Array(40)].map(() => uuidV4());

function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export const syncDataHandler = async (event: any) => {
  const response = {
    data: txIds,
  };

  await wait(6000);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  };
};
