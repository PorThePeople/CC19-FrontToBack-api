# Git commands

## Initialize

Create repository on Github

**Only once** in the local directory

```bash
git init
```

## Snapshot

Do some coding

```bash
git add .
git commit -m "Write a descriptive message"
```

## Push

Push code to Github

**Only once** on the first push (this code can be found after creating the repo on Github)

```bash
git remote add origin https://github.com/your_repo_link_here/
git branch -M main
git push -u origin main
```

For subsequent pushes, simply use

```bash
git push
```

Make sure to have `.gitignore` file, else all modules and dotenv file will also be pushed

## Pull/Clone

When pulling/cloning from Github, need to call `npm install` to install the necessary modules and create .env file

```bash
git clone https://github.com/your_repo_link_here/ .
npm install
```
