import { FastifyRequest, FastifyReply } from 'fastify';
import { request as reqGql, gql } from 'graphql-request';
import path from 'path';

enum Errors {
  API_ENDPOINT_NOT_DEFINED = 'Unable to connect to API.',
  SITES_PATH_NOT_DEFINED = 'Unable to read sites content.',
}

export async function rootRouteHandlerFactory() {
  const {
    API_ENDPOINT: apiUrl,
    SITES_PATH: sitesPath
  } = process.env;

  return async function rootRouteHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!apiUrl) {
        throw new Error(Errors.API_ENDPOINT_NOT_DEFINED);
      }

      if (!sitesPath) {
        throw new Error(Errors.SITES_PATH_NOT_DEFINED);
      }

      const { hostname, url } = request;
      const [fullDomain] = hostname.split(':');
      const [subdomain] = fullDomain.split('.');

      if (fullDomain === subdomain) {
        console.log('Boo')
        return reply.sendFile('index.html')
      }

      const query = gql`
        query GetSite($site: String!) {
          sites(where: { site: { _eq: $site }}) {
            path
            site
          }
        }`;
      const variables = {
        site: subdomain
      };

      const { sites: queryResponse } = await reqGql(apiUrl, query, variables);

      if (queryResponse.length < 1) {
        return reply.sendFile('404.html')
      }

      const { path: sitePath } = queryResponse[0];
      const PATH_TO_SITES = path.join(sitesPath, sitePath);

      return reply.sendFile(url, PATH_TO_SITES);
    } catch (error) {
      return reply.code(400).send(error);
    }
  };
}
