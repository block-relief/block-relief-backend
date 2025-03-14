import { config } from '../config/config';
import { create } from 'ipfs-http-client';

const projectId = config.IPFS_PROJECT_ID;
const projectSecret = config.IPFS_API_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: { authorization: auth }
});
