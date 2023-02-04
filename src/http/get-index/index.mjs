// asap as arc.http.async middleware
import arc from "@architect/functions";
import asap from "@architect/asap";

export const handler = arc.http.async(render, asap());

async function render(req) {
  // If user is logged in, show them a custom logged in page
  if (req.path === "/" && req.session.account) {
    return { html: `<body>Hello ${req.session.account.name}!</body>` };
  }

  //
  // Otherwise, load the logged out static page
  return;
}
