// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '0bzhdt4iu2'
const region = 'eu-west-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-cloud-project4.eu.auth0.com',            // Auth0 domain
  clientId: 'L5oWFrsn10MJlT9cVPFLmUFDRdSM2jSp',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
