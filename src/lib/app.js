import express from 'express';
import fs from 'fs';
import saml2 from 'saml2-js';
import { urlencoded as parseUrlEncoded } from 'body-parser';

const app = express();

const serviceOptions = {
  entity_id: 'http://www.okta.com/exk8dgmv1jnTXSaah0h7',
  assert_endpoint: 'https://478915bd.ngrok.io/saml/auth',
  allow_unencrypted_assertion: true
};

const service = new saml2.ServiceProvider(serviceOptions);

const identityOptions = {
  sso_login_url: 'https://careerbuilder.oktapreview.com/app/ddubs_ddubstest_1/exk8dgmv1jnTXSaah0h7/sso/saml',
  sso_logout_url: 'https://careerbuilder.oktapreview.com/app/ddubs_ddubstest_1/exk8dgmv1jnTXSaah0h7/sso/saml',
  certificates: [fs.readFileSync('okta.cert').toString()]
};

const identity = new saml2.IdentityProvider(identityOptions);

app.get('/', (req, res) => res.json({ data: 'SAML Playground' }));

app.get('/login', (req, res) => {
  service.create_login_request_url(identity, {}, (err, url, reqId) => {
    if (err) return res.status(500).json({ errors: [err] });
    res.redirect(url);
  });
});

app.post('/saml/auth', parseUrlEncoded(), (req, res) => {
  const assertOptions = { request_body: req.body };

  service.post_assert(identity, assertOptions, function(err, samlResponse) {
    if (err !== null) return res.status(500).send({ errors: [err.message] });

    // Save name_id and session_index for logout
    // Note:  In practice these should be saved in the user session, not globally.
    const { name_id: nameId, session_index: session } = samlResponse.user;

    res.json({ data: { nameId, session } });
  });
});

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
})

export default app;
