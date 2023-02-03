import arc from "@architect/functions";

// learn more about HTTP functions here: https://arc.codes/http
export async function handler(req) {
  let client = await arc.tables();

  // // create Chuck and Jana
  let chuck = await client.testdata.put({
    //
    oid: "123",
    email: "chuck@example.com",
    job: "Web Developer" + Math.random(),
    age: 35,
  });

  console.log(chuck);

  // let chuck2 = await testdata.put({
  //   //
  //   oid: "1234",
  //   email: "chuck@example.com",
  //   job: "Web Developer",
  //   age: 35,
  // });

  // // let jana = await testdata.put({
  // //   email: "jana@example.com",
  // //   job: "Web Developer",
  // //   age: 64,
  // // });

  // // await client._doc.transactWrite({
  // //   TransactItems: [
  // //     { Put: { TableName: "testdata", Key: { email: chuck.email } } },
  // //     { Put: { TableName: "testdata", Key: { email: jana.email } } },
  // //   ],
  // // });

  // // scan the entire table for people over 64
  let retired = await client.testdata.scan({
    FilterExpression: "age >= :givenAge",
    ExpressionAttributeValues: { ":givenAge": 3 },
  });
  console.log(retired.Items);

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
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Architect</title>
  <style>
     * { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; } .max-width-320 { max-width: 20rem; } .margin-left-8 { margin-left: 0.5rem; } .margin-bottom-16 { margin-bottom: 1rem; } .margin-bottom-8 { margin-bottom: 0.5rem; } .padding-32 { padding: 2rem; } .color-grey { color: #333; } .color-black-link:hover { color: black; }
  </style>
</head>
<body class="padding-32">

    <pre>${JSON.stringify(retired.Items)}</pre>
  <div class="max-width-320">
    <img src="https://assets.arc.codes/logo.svg" />
    <div class="margin-left-8">
      <div class="margin-bottom-16">
        <h1 class="margin-bottom-16">
          Hello from an Architect Node.js function!
        </h1>
        <p class="margin-bottom-8">
          Get started by editing this file at:
        </p>
        <code>
          agape-arc/src/http/get-index/index.mjs
        </code>
      </div>
      <div>
        <p class="margin-bottom-8">
          View documentation at:
        </p>
        <code>
          <a class="color-grey color-black-link" href="https://arc.codes">https://arc.codes</a>
        </code>
      </div>
    </div>
  </div>
</body>
</html>
`,
  };
}
