import { Octokit } from '@octokit/rest';

let octokit = null;
let owner = null;
let repo = null;

function getClient() {
  if (!octokit) {
    octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    owner = process.env.GITHUB_OWNER;
    repo = process.env.GITHUB_REPO;
    if (!owner || !repo) {
      throw new Error('GITHUB_OWNER and GITHUB_REPO must be set');
    }
  }
  return { octokit, owner, repo };
}

async function getFileSha(path) {
  try {
    const { octokit, owner, repo } = getClient();
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    return data.sha;
  } catch {
    return undefined;
  }
}

export async function uploadFile(path, content, message = 'upload') {
  const { octokit, owner, repo } = getClient();
  const sha = await getFileSha(path);
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    ...(sha ? { sha } : {}),
  });
}

export async function getFile(path) {
  try {
    const { octokit, owner, repo } = getClient();
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

export async function listDir(path) {
  try {
    const { octokit, owner, repo } = getClient();
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    if (Array.isArray(data)) {
      return data.map((f) => ({ name: f.name, type: f.type, path: f.path }));
    }
    return [];
  } catch {
    return [];
  }
}

export async function deleteFile(path) {
  try {
    const { octokit, owner, repo } = getClient();
    const sha = await getFileSha(path);
    if (sha) {
      await octokit.rest.repos.deleteFile({
        owner,
        repo,
        path,
        message: `delete ${path}`,
        sha,
      });
    }
  } catch (e) {
    console.error(`[github] deleteFile error: ${path}`, e.message);
  }
}
