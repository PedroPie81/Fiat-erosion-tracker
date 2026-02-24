import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { globby } from 'globby';

async function sync() {
  const dir = process.cwd();
  let token = "";
  try {
    token = fs.readFileSync('token.txt', 'utf8').trim();
  } catch (e) {
    token = process.env.GITHUB_TOKEN || "";
  }
  
  if (!token) {
    console.error("GITHUB_TOKEN not found in environment");
    process.exit(1);
  }

  try {
    console.log('Initializing git...');
    try { await git.init({ fs, dir }); } catch (e) {}
    
    console.log('Adding remote...');
    try {
      await git.addRemote({
        fs,
        dir,
        remote: 'origin',
        url: 'https://github.com/PedroPie81/Fiat-erosion-tracker.git'
      });
    } catch (e) {}
    
    const branch = (await git.currentBranch({ fs, dir })) || 'master';
    
    console.log('Staging files...');
    const paths = await globby(['**/*', '**/.*'], {
      ignore: ['.git/**', 'node_modules/**', 'dist/**', 'token.txt'],
      dot: true
    });
    
    for (const filepath of paths) {
      await git.add({ fs, dir, filepath });
    }
    
    console.log('Committing...');
    const sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'AI Assistant',
        email: 'assistant@aistudio.google.com'
      },
      parent: ['4c2bcc1539a38920516c47ba5ac879d77b6b51b5'],
      message: 'Final clean version: Removed sync button and API'
    });

    console.log('Updating branch ref...');
    await git.writeRef({
      fs,
      dir,
      ref: 'refs/heads/ai-studio-update',
      value: sha,
      force: true
    });

    console.log('Pushing to GitHub...');
    await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'ai-studio-update',
      onAuth: () => ({ username: token, password: '' })
    });

    console.log('Successfully pushed to GitHub');
  } catch (err) {
    console.error('Error in git operation:', err);
    process.exit(1);
  }
}

sync();
