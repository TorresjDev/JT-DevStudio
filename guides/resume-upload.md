# 📄 Resume Upload Guide

To ensure your resume is downloadable on your site, follow these fast and efficient steps:

### 1. Place the File in the `public` Folder
Add your PDF file (e.g., `resume.pdf`) directly into the `public/` directory of your project:
`c:\Github repos\JT-DevStudio\public\resume.pdf`

> [!TIP]
> Make sure the filename is **exactly** what is linked in the code (usually `resume.pdf` or capitalizations matter in production).

### 2. Push to GitHub
Commit and push the file using your terminal:
```bash
git add public/resume.pdf
git commit -m "docs: add resume"
git push origin main
```

### 3. Verification
Once pushed and deployed, the file will be accessible at:
`https://[your-domain]/resume.pdf`

Currently, the "About" page has a button that links directly to `/resume.pdf`, so it will work automatically!
