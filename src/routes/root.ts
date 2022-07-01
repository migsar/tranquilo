import { FastifyRequest, FastifyReply } from 'fastify';
import { request as reqGql, gql } from 'graphql-request';
import path from 'path';

enum Errors {
  API_ENDPOINT_NOT_DEFINED = 'Unable to connect to API.',
  SITES_PATH_NOT_DEFINED = 'Unable to read sites content.',
}

type ProcessUrlResult = {
  isRoot: boolean,
  subdomain: string,
  isValid: boolean
};

function processUrl(hostname: string, canonicalDomain: string): ProcessUrlResult {
  const domainRegEx = new RegExp(`(.*?)\\.?${canonicalDomain}$`);
  const matchResult = hostname.match(domainRegEx);
  const isValid = matchResult !== null;
  const [ isRoot, subdomain] = isValid ? [matchResult[1] === '', matchResult[1]] : [false, ''];

  return {
    isValid,
    isRoot,
    subdomain,
  };
};

export async function rootRouteHandlerFactory() {
  const {
    CANONICAL_DOMAIN: canonicalDomain,
    API_ENDPOINT: apiUrl,
    SITES_PATH: sitesPath,
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
      const { isRoot, subdomain } = processUrl(hostname, canonicalDomain || '');

      if (isRoot) {
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

      const { sites: queryResponse } = await reqGql({
        url: apiUrl,
        document: query,
        variables
      });

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
