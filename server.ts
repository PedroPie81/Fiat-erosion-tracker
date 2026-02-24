import express from "express";
import { createServer as createViteServer } from "vite";
import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for GitHub sync
  app.post("/api/github-sync", async (req, res) => {
    const dir = process.cwd();
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return res.status(400).json({ error: "GITHUB_TOKEN not found in environment" });
    }

    try {
      // Initialize if not already
      try {
        await git.init({ fs, dir });
      } catch (e) {}
      
      // Add remote if not already
      try {
        await git.addRemote({
          fs,
          dir,
          remote: 'origin',
          url: 'https://github.com/PedroPie81/Fiat-erosion-tracker.git'
        });
      } catch (e) {}
      
      const branch = (await git.currentBranch({ fs, dir })) || 'master';
      
      // Stage all files
      const files = await fs.promises.readdir(dir);
      for (const file of files) {
        if (file !== '.git' && file !== 'node_modules' && file !== 'dist') {
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
        ref: branch,
        onAuth: () => ({ username: token, password: '' })
      });

      res.json({ success: true, message: "Successfully pushed to GitHub" });
    } catch (err: any) {
      console.error('Error in git operation:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
