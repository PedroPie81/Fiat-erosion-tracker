import fs from 'fs';
import git from 'isomorphic-git';
import path from 'path';
// @ts-ignore
import http from 'isomorphic-git/http/node';

async function setup() {
  const dir = process.cwd();
  
  try {
    // Initialize if not already
    try {
      await git.init({ fs, dir });
      console.log('Initialized git repository');
    } catch (e) {
      console.log('Git repository already initialized');
    }
    
    // Add remote if not already
    try {
      await git.addRemote({
        fs,
        dir,
        remote: 'origin',
        url: 'https://github.com/PedroPie81/Fiat-erosion-tracker.git'
      });
      console.log('Added remote origin');
    } catch (e) {
      console.log('Remote origin already exists');
    }
    
    // Check current branch
    const branch = await git.currentBranch({ fs, dir });
    console.log('Current branch:', branch);

    // If GITHUB_TOKEN is present, try to push
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      console.log('GITHUB_TOKEN found, attempting to push...');
      
      // Stage all files
      const files = await fs.promises.readdir(dir);
      for (const file of files) {
        if (file !== '.git' && file !== 'node_modules') {
          await git.add({ fs, dir, filepath: file });
        }
      }
      
      await git.commit({
        fs,
        dir,
        author: {
          name: 'AI Assistant',
          email: 'assistant@aistudio.google.com'
        },
        message: 'Sync from AI Studio'
      });

      await git.push({
        fs,
        http,
        dir,
        remote: 'origin',
        ref: branch || 'master',
        onAuth: () => ({ username: token, password: '' })
      });
      console.log('Successfully pushed to GitHub');
    } else {
      console.log('GITHUB_TOKEN not found. Set it in the Secrets panel to enable manual push.');
    }
    
  } catch (err) {
    console.error('Error in git operation:', err);
  }
}

setup();
