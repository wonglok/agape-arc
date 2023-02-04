export async function handler(req) {
  return {
    cors: true,
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      "content-type": "text/html; charset=utf8",
    },
    body: /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Welcome</title>
      <style>
         * { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
      </style>
    </head>
      <body class="" style="padding: 20px">
        <h1 style="margin-bottom: 15px;">Welcome!</h1>

      </body>
    </html>
  `,
  };
}

// learn more about HTTP functions here: https://arc.codes/http

// let { jwt } = await Auth.signUserJWT({ address: "a12321312123" });

// let client = await arc.tables();

// // // create Chuck and Jana
// let chuck = await client.testdata.put({
//   //
//   oid: "123",
//   email: "chuck@example.com",
//   job: "Web Developer" + Math.random(),
//   age: 35,
// });

// console.log(chuck);

// // let chuck2 = await testdata.put({
// //   //
// //   oid: "1234",
// //   email: "chuck@example.com",
// //   job: "Web Developer",
// //   age: 35,
// // });

// // // let jana = await testdata.put({
// // //   email: "jana@example.com",
// // //   job: "Web Developer",
// // //   age: 64,
// // // });

// // // await client._doc.transactWrite({
// // //   TransactItems: [
// // //     { Put: { TableName: "testdata", Key: { email: chuck.email } } },
// // //     { Put: { TableName: "testdata", Key: { email: jana.email } } },
// // //   ],
// // // });

// // // scan the entire table for people over 64
// let retired = await client.testdata.scan({
//   FilterExpression: "age >= :givenAge",
//   ExpressionAttributeValues: { ":givenAge": 3 },
// });
// console.log(retired.Ites);
