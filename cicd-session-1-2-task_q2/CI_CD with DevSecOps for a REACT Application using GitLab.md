# Who am I

I'm Tarek Adel, a DevSecOps Engineer, and I'll discuss a task in DevSecOps.
[My LinkedIn Profile](https://www.linkedin.com/in/tarek-adel-857279197/)

# Overview

This is a DevSecOps task. In this task, we will implement an application, like a REACT app, with pipelines integrated with GitLab.
We will discuss the task needs, the problems encountered, the stages implemented, the variables used, and whether we used GitLab runners or a local runner.

# Task Needs

## Q2: CI/CD with DevSecOps for Angular or React Frontend Using GitLab

---

This project builds a **secure and automated CI/CD pipeline** for an Angular (or React) frontend application using **GitLab CI/CD**. It emphasizes **DevSecOps principles**, incorporating frontend-specific security checks throughout the software delivery lifecycle. The pipeline automates build, test, static analysis, dependency scanning, and deployment steps, ensuring code quality and security before going live.

---

### **Objectives:**

- Automate the CI/CD process for a modern Angular or React application using GitLab.
- Integrate **frontend-focused security tools** to detect vulnerabilities and maintain code quality.
- Enforce best practices in **linting**, testing, and dependency safety throughout the pipeline.

---

### **Pipeline Stages:**

1.  **Install & Build:**
    -   Use **npm** or **yarn** to install dependencies and build the Angular/React application.
2.  **Lint & Unit Testing:**
    -   Run `ng lint` (Angular) or `eslint` (React) and unit tests using **Jasmine/Karma** or equivalent tools (like Jest for React).
3.  **SAST (Static Application Security Testing):**
    -   Analyze source code with **ESLint**, **GitLab SAST**, or similar static code analysis tools.
4.  **Dependency Scanning:**
    -   Detect vulnerable packages in `package.json` and `package-lock.json` using **npm audit**, **Snyk**, or GitLab's built-in scanners.
5.  **DAST (Optional):**
    -   Perform **dynamic testing** using **OWASP ZAP** on the deployed frontend to detect runtime vulnerabilities.
6.  **Deploy:**
    -   Deploy the application to **GitLab Pages**, **Firebase Hosting**, **Amazon S3**, or any other static hosting service.

---

### **Tools & Stack:**

-   **Framework:** Angular (or React)
-   **Build Tool:** Angular CLI, npm, yarn
-   **CI/CD Platform:** GitLab CI/CD
-   **Security Tools:**
    -   Linting & SAST: ESLint, GitLab SAST
    -   Dependency Scanning: npm audit, Snyk
    -   DAST (optional): OWASP ZAP
-   **Testing Frameworks:** Jasmine, Karma (or Jest for React)

---

### **Outcome:**

The outcome is a **complete, secure CI/CD pipeline** tailored for modern frontend development. By integrating **DevSecOps practices**, this pipeline ensures high-quality code, early detection of vulnerabilities, and smooth, automated delivery of the application. It provides teams with confidence in both the functionality and security of their frontend code before deployment.

# Runner

First, we will talk about the runner.
You can use the runner from GitLab itself, but after 400 minutes (Note: GitLab's free tier limits are typically based on CI/CD minutes), you will need to buy more minutes or upgrade your plan. Alternatively, you can implement your local runner.
The local runner consists of types like the shell runner or the docker runner.
Of course, the docker runner is better than the shell runner.
I'll give you some links to implement your local runner based on Docker:

1.  First, you need to install Docker Desktop on your machine (this is if you are using Windows). From the link itself, you can see your OS and install the version that fits you: [https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)
    This is the link you need to install Docker.
2.  Next step, you need to install the runner from GitLab: [https://docs.gitlab.com/runner/install/](https://docs.gitlab.com/runner/install/). You can read the instructions to download and use it.
3.  Final step, just authenticate the runner with your GitLab account using a token. You can see how from the same link.

# Stages

## Install Dependencies Stage

🧩 **Total Role (What does `install_dependencies` do?)**
This job installs the JavaScript/Node.js dependencies your app needs using npm.

✅ Think of it like downloading the tools your app needs before running.

🔍 **Line-by-Line Simple Explanation**

🔸 `install_dependencies:`
*   This is the name of the job.
*   🧠 **If you rename it:**
    Only the name changes. No error.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tells GitLab:
    “Use a machine that supports Docker.”
*   🧠 **If removed:**
    GitLab may not know which machine to use. The job may not run.

🔸 `stage: install_dependencies`
*   This tells GitLab the step (or stage) name.
*   🧠 **If removed:**
    GitLab may not run it in the correct order.

🔸 `image:`
    ```yaml
    image:
      name: node:latest
      entrypoint: [""]
    ```
*   `name: node:latest` → Use an image that has Node.js and npm.
*   `entrypoint: [""]` → Run the script directly, not the default Node.js REPL.
*   🧠 **If removed:**
    GitLab may not know how to run npm commands.
*   🧠 **If you don’t set entrypoint:**
    Sometimes it may run the wrong thing, like starting the Node REPL by mistake.

🔸 `script:`
    ```yaml
    script:
      - npm ci
    ```
*   👉 `npm ci` means "clean install" – it installs all packages exactly as defined in `package-lock.json`.
*   🧠 **Why:**
    It’s faster and more reliable than `npm install` in CI/CD environments.
*   🧠 **If removed:**
    The job won’t install your app’s packages. Other jobs may fail because files are missing.

🔸 `cache:`
    ```yaml
    cache:
      paths:
        - node_modules/
    ```
*   👉 Save the `node_modules/` directory to reuse it in the next pipeline run.
*   🧠 **Why:**
    To make future jobs faster by not downloading the same packages again.
*   🧠 **If removed:**
    Every job will download packages from scratch = slow.

🔸 `artifacts:`
    ```yaml
    artifacts:
      paths:
        - node_modules/
    ```
*   👉 Save the `node_modules/` directory to share it with other jobs in the *same* pipeline (like test or build).
*   🧠 **Why:**
    Other jobs can use the same installed files without reinstalling.
*   🧠 **If removed:**
    The next jobs may not find `node_modules` and may fail unless they install the dependencies again.

## Build Stage

🧩 **Total Role (What does `build` do?)**
This job builds the final, optimized version of the frontend app using the `npm run build` command (defined in your `package.json`).

✅ Think of it like: making the app ready for users (like compiling code, minimizing files, and putting everything in a `build/` or `dist/` folder 🍲).

🔍 **Line-by-Line Simple Explanation**

🔸 `build:`
*   This is the name of the job.
*   🧠 **If you rename it:**
    No problem. Just changes the job name.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tells GitLab:
    "Use a machine that supports Docker."
*   🧠 **If removed:**
    GitLab might not know which runner to use. The job may not run.

🔸 `dependencies:`
    ```yaml
    dependencies:
      - install_dependencies
    ```
*   This tells GitLab:
    “Wait for the `install_dependencies` job to finish and use its artifacts (specifically, the `node_modules` folder).”
*   🧠 **If removed:**
    The job won’t have the installed packages (`node_modules`) → it will likely fail because it can’t find the necessary tools or libraries to build the application.

🔸 `stage: build`
*   This tells GitLab the job is part of the `build` step in the pipeline.
*   🧠 **If removed:**
    GitLab won’t know when to run this job in the correct order.

🔸 `image:`
    ```yaml
    image:
      name: node:latest
      entrypoint: [""]
    ```
*   `name: node:latest` → Use an image with Node.js and npm.
*   `entrypoint: [""]` → Make sure GitLab runs the script directly.
*   🧠 **If removed:**
    `npm run build` may not work if the environment doesn't have Node.js or npm installed.

🔸 `script:`
    ```yaml
    script:
      - npm run build
    ```
*   👉 This command executes the `build` script defined in your project's `package.json` file.
*   It usually creates a `build/` or `dist/` folder containing the final, static application files ready for deployment.
*   🧠 **If removed:**
    Nothing will be built. Subsequent jobs like `deploy` might fail because there are no built files to deploy.

🔸 `artifacts:`
    ```yaml
    artifacts:
      paths:
        - build/ # Or dist/, depending on your framework
    ```
*   👉 Save the `build/` (or `dist/`) folder for other jobs in the same pipeline (like `deploy`).
*   🧠 **Why:**
    The next jobs (like deployment) need this folder containing the built application.
*   🧠 **If removed:**
    The built application files will not be shared. Other jobs (like `deploy`) may fail or have nothing to work with.

## ESLint & Jest Test Stage

🧩 **Total Role (What does `eslint-jest-test` do?)**
This job performs two main tasks:

1.  🔍 Checks your JavaScript/TypeScript code for style errors and potential mistakes using ESLint.
2.  🧪 Runs automated tests (unit tests, integration tests) using Jest.
3.  📦 Saves the results (reports) from both tools as files.

✅ Think of it like:
*   ESLint = A grammar and style checker for your code.
*   Jest = A quality assurance tester checking if the code behaves as expected.

🔍 **Line-by-Line Simple Explanation**

🔸 `eslint-jest-test:`
*   This is the name of the job.
*   🧠 **If renamed:**
    Just a label. No effect on behavior.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tells GitLab:
    Use a runner that supports Docker.
*   🧠 **If removed:**
    GitLab might not find the right runner. The job might fail.

🔸 `stage: eslint-jest-test`
*   This is the stage name.
*   It tells GitLab: run this job in the `eslint-jest-test` step.
*   🧠 **If removed:**
    GitLab won’t know where to put the job in the pipeline order.

🔸 `image:`
    ```yaml
    image:
      name: node:latest
      entrypoint: [""]
    ```
*   `node:latest` → uses a Docker image with Node.js and npm (which allows running `npx`).
*   `entrypoint: [""]` → allows GitLab to run commands directly.
*   🧠 **If removed:**
    The job may not find `npx`, `eslint`, or `jest` if they aren't installed globally on the runner.

🔸 `script:`
*   List of commands to run:

*   🟠 `npx eslint . --fix -f json -o test-report.json || true`
    *   ✅ **What it does:**
        *   `npx eslint .`: Runs ESLint on all files in the current directory (`.`).
        *   `--fix`: Attempts to automatically fix simple style issues.
        *   `-f json -o test-report.json`: Formats the output as JSON and saves it to `test-report.json`.
        *   `|| true`: If ESLint finds errors (and exits with a non-zero code), the `|| true` ensures the script continues to the next command instead of stopping the job.
    *   🧠 **Why:**
        To find and report (or fix) style/code issues without necessarily breaking the pipeline just for linting errors. You can review the report later.
    *   🧠 **If removed:**
        No code style check is done. You might push code with inconsistencies or potential issues.
    *   🧠 **If you remove `|| true`:**
        If ESLint finds errors it cannot fix, the job will stop (fail).

*   🟠 `cat test-report.json`
    *   ✅ Shows the contents of the ESLint JSON report directly in the GitLab job log.
    *   🧠 **Why:**
        To make the linting results immediately visible in the job output for quick inspection.
    *   🧠 **If removed:**
        The job still works, but you won’t see the ESLint results directly in the log (you'd have to check the artifact).

*   🟠 `npx jest --json --outputFile=jest-report.json --ci`
    *   ✅ Runs tests using Jest.
        *   `npx jest`: Executes the Jest test runner.
        *   `--json --outputFile=jest-report.json`: Saves the test results in JSON format to `jest-report.json`.
        *   `--ci`: Runs Jest in a mode suitable for Continuous Integration environments (e.g., no interactive prompts, optimized output).
    *   🧠 **If removed:**
        No automated tests will run = you won’t know if your code changes broke existing functionality.

🔸 `artifacts:`
    ```yaml
    artifacts:
      when: always
      paths:
        - test-report.json
        - jest-report.json
    ```
*   ✅ This saves the ESLint report (`test-report.json`) and the Jest report (`jest-report.json`) as job artifacts.
*   `when: always` = save them even if the job fails (e.g., if tests fail).
*   🧠 **If removed:**
    No report files will be saved for later viewing or processing by other tools/stages.

## SAST Stage

🧩 **Total Role (What does `sast` do?)**
This job runs Static Application Security Testing (SAST).
In simple terms: It automatically checks your application's source code for potential security vulnerabilities *before* the code is run.
(يعني: يفحص كود البرنامج عشان يلاقي مشاكل أمان قبل ما تشغل البرنامج).

✅ Think of it like:
*   A security expert reading your code to find possible security weaknesses or bad practices.

🔍 **Line-by-Line Simple Explanation**

🔸 `sast:`
*   This is the name of the job.
*   🧠 **If renamed:**
    Only changes the name, no big effect on functionality if using the template.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tells GitLab:
    Use a runner with Docker (required by the included template).
*   🧠 **If removed:**
    GitLab might not find the right machine to run this job, as the template likely requires Docker.

🔸 `stage: sast`
*   This tells GitLab to run this job in the `sast` stage (typically after build/test but before deploy).
*   🧠 **If removed:**
    GitLab won’t know when to run this job in the pipeline order.

🔸 `artifacts:`
    ```yaml
    artifacts:
      reports:
        sast: gl-sast-report.json
    ```
*   This configuration tells GitLab to specifically look for a SAST report named `gl-sast-report.json`.
*   GitLab uses this report to display security findings directly in the Merge Request UI and the Security Dashboard.
*   🧠 **If removed:**
    The report file might still be generated by the template, but GitLab won't automatically recognize it to display the security findings in the UI.

🔸 `include:`
    ```yaml
    include:
      - template: Security/SAST.gitlab-ci.yml
    ```
*   This line is the core of this job. It includes a predefined template provided by GitLab.
*   This template contains all the necessary logic to automatically detect your project type (Node.js, Java, Python, etc.) and run the appropriate SAST analyzers.
*   🧠 **Why:**
    You don’t have to manually configure and run different SAST tools. GitLab handles it for you based on your project's code.
*   🧠 **If removed:**
    No security scan will run because the instructions for the scan (which are in the template) are missing.

## Dependencies Scan Stage

🧩 **Total Role (What does `snyk_scan` do?)**
This job uses a tool called Snyk to scan your project's dependencies (the external libraries or packages your app uses, listed in `package.json` / `package-lock.json`) for known security vulnerabilities.

✅ Think of it like:
*   A security check for all the third-party tools and libraries your application relies on.

🔍 **Line-by-Line Simple Explanation**

🔸 `snyk_scan:`
*   This is the job’s name.
*   🧠 **If renamed:**
    No problem, just changes the label.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tells GitLab:
    Use a Docker-capable runner.
*   🧠 **If removed:**
    GitLab may not find the right machine. The job might fail.

🔸 `stage: dependencies_scan`
*   This tells GitLab:
    Run this job in the `dependencies_scan` step.
*   🧠 **If removed:**
    GitLab won’t know the correct order to run this job.

🔸 `script:`
*   Commands to run, step by step:

*   🔹 `npm install -g snyk`
    *   Installs the `snyk` command-line tool globally within the job's environment.
    *   🧠 **Why:**
        You need the `snyk` command available to perform the scan.
    *   🧠 **If removed:**
        The subsequent `snyk` commands won’t work → the job fails.

*   🔹 `snyk auth $SNYK_TOKEN`
    *   Authenticates (logs in) to Snyk using a secret API token stored in the GitLab CI/CD variable `$SNYK_TOKEN`. **You must configure this variable in your GitLab project settings.**
    *   🧠 **Why:**
        Snyk needs to associate the scan with your account to provide results, track projects, and enforce usage limits.
    *   🧠 **If removed:**
        Snyk will likely refuse to scan or monitor your project, resulting in an error.

*   🔹 `snyk test --json > snyk-report.json || true`
    *   `snyk test`: Runs the Snyk security scan to find vulnerabilities in dependencies.
    *   `--json`: Outputs the results in JSON format.
    *   `> snyk-report.json`: Redirects the JSON output and saves it to a file named `snyk-report.json`.
    *   `|| true`: If the `snyk test` command finds vulnerabilities (it typically exits with a non-zero code in that case), the `|| true` ensures the job doesn't fail immediately. The pipeline continues.
    *   🧠 **Why:**
        To perform the scan, save the results, and keep the pipeline running even if vulnerabilities are found, allowing you to review the report later. Remove `|| true` if you want the pipeline to fail when vulnerabilities are detected.
    *   🧠 **If removed:**
        If vulnerabilities exist, the job will fail and stop the pipeline (unless `|| true` is present).

*   🔹 `snyk monitor`
    *   Takes a snapshot of your project's dependencies and sends it to the Snyk web dashboard for continuous monitoring. Snyk will then notify you if new vulnerabilities affecting your project are discovered later.
    *   🧠 **Why:**
        So you can monitor your project's dependency health over time via the Snyk UI and get alerted about new issues.
    *   🧠 **If removed:**
        You won’t get the continuous monitoring benefits in the Snyk web dashboard for this project.

🔸 `artifacts:`
    ```yaml
    artifacts:
      when: always
      paths:
        - snyk-report.json
    ```
*   Saves the `snyk-report.json` file for later viewing or processing.
*   `when: always` → save the report even if the job fails (e.g., due to an authentication error).
*   🧠 **If removed:**
    No report file will be saved as a GitLab artifact, making it harder to check the vulnerability details after the job ends.

## Deploy Stage

🧩 **Total Role (What does `docker_build_push` do?)**
This job takes your frontend application code (usually after it has been built into static files), builds a Docker image containing those files (often served by a simple web server like Nginx), tags the image with appropriate names/versions, and pushes (uploads) it to a container registry like Docker Hub.

✅ Think of it like:
*   Packaging your built website into a ready-to-run box (Docker image), labeling the box clearly, and sending it to a storage warehouse (Docker Hub) so it can be easily deployed later.

🔍 **Line-by-Line Simple Explanation**

🔸 `docker_build_push:`
*   The name of the job.
*   🧠 **If renamed:**
    No problem, just changes the name.

🔸 `stage: deploy`
*   Tells GitLab this job is in the `deploy` phase (usually one of the last stages).
*   🧠 **If removed:**
    GitLab won’t know when to run this job in the pipeline sequence.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tells GitLab:
    Use a runner that supports Docker.
*   🧠 **If removed:**
    The job might not run because no suitable runner is found.

🔸 `image: docker:latest`
*   Use the official `docker:latest` image, which provides the Docker client tools needed for the script.
*   🧠 **If removed:**
    Docker commands (`login`, `build`, `tag`, `push`) won’t work.

🔸 `services:`
    ```yaml
    services:
      - name: docker:dind
        alias: docker
    ```
*   This starts the Docker daemon service (Docker-in-Docker) alongside the job, allowing the Docker client to build and push images.
*   🧠 **If removed:**
    Docker `build` or `push` commands will fail because there's no Docker daemon to connect to.

🔸 `variables:`
    ```yaml
    variables:
      DOCKER_HOST: tcp://docker:2375
      DOCKER_TLS_CERTDIR: ""
    ```
*   These settings configure the Docker client inside the job container to connect to the `dind` service correctly.
*   🧠 **If removed:**
    Docker commands may fail to connect to the Docker daemon.

🔸 `dependencies:`
    ```yaml
    dependencies:
      - build
    ```
*   This means this job needs artifacts from the previous `build` job (specifically, the `build/` or `dist/` folder containing the static frontend files).
*   🧠 **If removed:**
    The `docker build` command might fail because the necessary application files are missing from the context, resulting in an incomplete or failed image build.

🔸 `script:`
*   Commands to run step by step:

*   🔹 `docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"`
    *   Logs in to Docker Hub using credentials stored in GitLab CI/CD variables `$DOCKER_USERNAME` and `$DOCKER_PASSWORD`. **Remember to set these variables.**
    *   🧠 **If removed:**
        You likely can’t push images to Docker Hub (authentication required).

*   🔹 `docker build -t $DOCKER_USERNAME/react-app .`
    *   Builds the Docker image using the `Dockerfile` located in the current directory (`.`).
    *   `-t $DOCKER_USERNAME/react-app`: Tags the image with a name (e.g., `yourusername/react-app`). Replace `react-app` with your actual app name.
    *   🧠 **If removed:**
        No Docker image will be built.

*   🔹 `docker tag $DOCKER_USERNAME/react-app $DOCKER_HUB_REPO:latest`
    *   Adds an additional tag, `$DOCKER_HUB_REPO:latest`, to the image built previously. `$DOCKER_HUB_REPO` should be a variable holding the full repository name (e.g., `yourusername/your-repo-name`).
    *   🧠 **If removed:**
        The image won't be tagged as `latest` for your Docker Hub repository.

*   🔹 `docker tag $DOCKER_USERNAME/react-app $DOCKER_HUB_REPO:$CI_COMMIT_SHORT_SHA`
    *   Adds another tag using the short commit SHA (e.g., `yourusername/your-repo-name:a1b2c3d4`). This creates a unique tag for this specific version.
    *   🧠 **If removed:**
        You lose the ability to identify and pull this specific version from Docker Hub using its commit ID.

*   🔹 `docker push $DOCKER_HUB_REPO:latest`
    *   Uploads the image tagged as `latest` to your Docker Hub repository.
    *   🧠 **If removed:**
        Users or systems pulling the `latest` tag won’t get this newest version.

*   🔹 `docker push $DOCKER_HUB_REPO:$CI_COMMIT_SHORT_SHA`
    *   Uploads the image tagged with the specific commit SHA to Docker Hub.
    *   🧠 **If removed:**
        This specific version build won't be available on Docker Hub under its unique commit tag.

🔸 `only:`
    ```yaml
    only:
      - main
    ```
*   Specifies that this `deploy` job should run *only* when changes are pushed or merged to the `main` branch.
*   🧠 **If removed:**
    The job would attempt to run on every push to any branch, which might lead to unnecessary deployments or resource usage.

## DAST Stage (tarek-dast)

🧩 **Total Role (What does `tarek-dast` do?)**
This job runs DAST (Dynamic Application Security Testing) using the OWASP ZAP tool against the *running* frontend application.
In essence:

1.  It starts the frontend application (likely the Docker image built earlier) in a container.
2.  It runs the ZAP scanner in another container.
3.  ZAP actively probes the running application (like a user browsing it, but looking for security flaws) to find vulnerabilities that only appear at runtime.
4.  It generates reports detailing any security issues found.

✅ Think of it like:
*   A security tester actively trying to 'break into' or find weaknesses in your live website/application.

🔍 **Line-by-Line Simple Explanation**

🔸 `tarek-dast:`
*   Job name (as provided in the original text).

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tell GitLab: Use a runner with Docker support.

🔸 `stage: tarek-dast`
*   Put this job in the `tarek-dast` stage of the pipeline.

🔸 `image:`
    ```yaml
    image:
      name: docker:latest
      entrypoint: [""]
    ```
*   Use the latest Docker image to get `docker` commands.
*   `entrypoint: [""]` ensures the script commands run directly.

🔸 `services:`
    ```yaml
    services:
      - name: docker:dind
        alias: docker
    ```
*   Start Docker-in-Docker service to allow running containers (the app and ZAP).

🔸 `variables:`
    ```yaml
    variables:
      DOCKER_HOST: tcp://docker:2375
      DOCKER_TLS_CERTDIR: ""
    ```
*   Set Docker connection info so Docker commands work inside the GitLab runner environment.

🔸 `script:`
*   Commands to run one by one:

*   🔹 `mkdir -p zap-wrk`
    *   Make a directory named `zap-wrk` to store ZAP working files and reports.
    *   🧠 **If removed:**
        The volume mount for ZAP might fail, or ZAP won't be able to save reports.

*   🔹 `chmod 777 zap-wrk`
    *   Give full read/write/execute permissions to this folder.
    *   🧠 **If removed:**
        The ZAP container might not have permission to write reports into the mounted `zap-wrk` directory.

*   🔹 `docker network inspect zapnet || docker network create zapnet`
    *   Checks if a Docker network named `zapnet` exists. If not (`||`), it creates it.
    *   🧠 **Why:**
        To create a dedicated network allowing the application container and the ZAP container to easily find and communicate with each other by name.
    *   🧠 **If removed:**
        Containers might be on the default bridge network, making communication harder or requiring reliance on less reliable methods like linking or IP addresses.

*   🔹 `docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"`
    *   Log in to Docker Hub (needed if the app image is private).

*   🔹 `docker pull $DOCKER_HUB_REPO:latest`
    *   Download the latest image of the application.

*   🔹 `docker run -d --rm --name tarek-react-app --network zapnet $DOCKER_HUB_REPO:latest`
    *   Run the application container:
        *   `-d`: Detached (background).
        *   `--rm`: Automatically remove the container when it stops.
        *   `--name tarek-react-app`: Give the container a specific name.
        *   `--network zapnet`: Connect the container to the `zapnet` network.
        *   `$DOCKER_HUB_REPO:latest`: The application image to run.

*   🔹 `for i in {1..30}; do curl -f http://tarek-react-app && break || (echo "Waiting for app..."; sleep 2); done`
    *   This is a loop that tries to check if the application is ready.
    *   It runs up to 30 times.
    *   `curl -f http://tarek-react-app`: Tries to access the application using its container name (`tarek-react-app`) as the hostname (this works because they are on the same `zapnet` network). `-f` makes curl fail silently on HTTP errors.
    *   `&& break`: If curl succeeds (app is responding), exit the loop (`break`).
    *   `|| (echo "Waiting for app..."; sleep 2)`: If curl fails, print "Waiting for app...", wait 2 seconds (`sleep 2`), and try again.
    *   🧠 **If removed:**
        ZAP might start scanning before the application is fully initialized and ready to respond, leading to an incomplete or failed scan.

*   🔹 `docker run --rm -v $(pwd)/zap-wrk:/zap/wrk --network zapnet zaproxy/zap-stable zap-baseline.py -t "http://tarek-react-app" -g gen.conf -r report.html -w report.md -J report.json || true`
    *   Run the OWASP ZAP baseline scan in a container:
        *   `--rm`: Remove the ZAP container after it finishes.
        *   `-v $(pwd)/zap-wrk:/zap/wrk`: Mount the local `zap-wrk` directory into `/zap/wrk` inside the ZAP container for report saving.
        *   `--network zapnet`: Connect the ZAP container to the same network as the app container.
        *   `zaproxy/zap-stable`: The official ZAP Docker image.
        *   `zap-baseline.py`: The script within the image to run a baseline (non-intrusive) scan.
        *   `-t "http://tarek-react-app"`: The target URL to scan (using the app container's name as hostname).
        *   `-g gen.conf`: Generate a configuration file (optional).
        *   `-r report.html -w report.md -J report.json`: Generate reports in HTML, Markdown, and JSON formats inside the container's `/zap/wrk` directory.
        *   `|| true`: Ensure the GitLab job doesn't fail even if ZAP finds vulnerabilities and exits with an error code.

*   🔹 `cp zap-wrk/report.html zap-wrk/report.md zap-wrk/report.json . || true`
    *   Copy the generated reports from the `zap-wrk` subdirectory to the main job directory (`.`).
    *   🧠 **Why:**
        To make the reports easily accessible for the `artifacts` section.
    *   `|| true`: Ignore errors if a report file doesn't exist.

🔸 `artifacts:`
    ```yaml
    artifacts:
      when: always
      paths:
        - report.html
        - report.md
        - report.json
    ```
*   Save the ZAP reports after the job finishes, `always` (even if the job failed).

## Cleanup Stage

🚀 **Total Role of `cleanup`**
This stage’s job is to clean the workspace after the pipeline (or relevant stages) have run.
It deletes temporary files and folders created during the pipeline execution (like build outputs, test reports, downloaded dependencies, scan results, etc.).
This keeps the runner's workspace tidy and prevents leftover files from interfering with subsequent pipeline runs.

Think like:

*   After you finish cooking and eating, you wash the dishes and clean the kitchen so it’s ready for the next meal.

🔍 **Explanation of each line**

🔸 `cleanup:`
*   This is the name of the job.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   We say: “Use a runner that can run Docker jobs” (though for simple `rm` commands, any runner might work, `alpine` image is used which runs in Docker).

🔸 `stage: cleanup`
*   This means this job runs in the `cleanup` phase (usually the very last stage).

🔸 `image: alpine:latest`
*   Use a very small, minimal Linux system image called Alpine. It contains basic commands like `echo` and `rm`, which is all we need here, and it starts quickly.

🔸 `script:`
*   These are the commands the job will execute.

*   🔹 `echo " Clean workspace"`
    *   Prints the message “ Clean workspace” to the job log.
    *   (It’s just a message to indicate what the job is doing.)

*   🔹 `rm -rf build/ zap-wrk/ node_modules/`
    *   Deletes the specified directories and their contents recursively (`-r`) and forcefully (`-f`, suppresses errors if they don't exist).
        *   `build/`: Folder containing the built project files.
        *   `zap-wrk/`: Folder containing files from the ZAP security scan.
        *   `node_modules/`: Folder containing installed Node.js packages.

*   🔹 `rm -f test-report.json jest-report.json snyk-report.json report.html report.md report.json image.tar || true`
    *   Deletes the specified individual files forcefully (`-f`).
        *   `test-report.json`, `jest-report.json`: Test result files.
        *   `snyk-report.json`: Snyk scan result file.
        *   `report.html`, `report.md`, `report.json`: ZAP scan result files.
        *   `image.tar`: Saved Docker image file (if created in a previous stage).
    *   `|| true`: If any of these files do not exist (e.g., a stage was skipped or failed), the `rm -f` command might return an error; `|| true` ensures the entire script doesn't fail because of a missing file.

🔸 `when: always`
*   Run this `cleanup` job `always`, regardless of whether the previous stages in the pipeline succeeded or failed. This ensures cleanup happens even after a failure.

❗ **What happens if we remove lines?**
*   If we remove the `rm -rf ...` or `rm -f ...` lines, the specified files and folders will remain in the runner's workspace. This can consume disk space and potentially cause issues in subsequent pipeline runs if old files conflict with new ones.
*   If we remove `|| true` from the `rm -f` command, the job might fail if one of the specified files doesn't exist.
*   If we remove `when: always`, the cleanup job would only run if all preceding stages succeed. If the pipeline fails earlier, the workspace would not be cleaned up.

## Notify Stage

🧩 **Total Role (What does `slack-notify` do?)**
This job sends a notification message to a Slack channel to inform people (e.g., the development team) about the status of the pipeline.
In this specific example, it sends a message indicating that Task Q2 (the React application CI/CD pipeline) has completed successfully.

(يعني: بعد ما يخلص شغل الـ pipeline كله بنجاح، بنبعت رسالة على Slack عشان نعرف الفريق).

🔍 **Line-by-Line Simple Explanation**

🔸 `slack-notify:`
*   Job name.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Use a GitLab runner that supports Docker (needed for the `curlimages/curl` image).

🔸 `dependencies:`
    ```yaml
    dependencies:
      - docker_build_push # Or the last critical stage, e.g., deploy
    ```
*   This job depends on the `docker_build_push` job (or whichever is the final deployment/critical stage).
*   (يعني: `slack-notify` مش هيشتغل غير لما `docker_build_push` يخلص بنجاح).
*   This ensures the notification is sent only after a successful deployment.

🔸 `stage: notify`
*   This job is in the `notify` phase (يعني مرحلة الإشعار أو التنبيه).

🔸 `image: curlimages/curl:latest`
*   Use a minimal Docker image that only contains the `curl` command-line tool.
*   (لأننا هنستخدم `curl` عشان نبعت الرسالة لـ Slack).

🔸 `script:`
*   The command(s) to run:

*   🔹 `curl -X POST -H 'Content-type: application/json' --data '{"text": "The task Q2 CI/CD with DevSecOps for REACT Application Using GitLab has been completed successfully"}' $SLACK_WEBHOOK_URL`
    *   Sends an HTTP POST request to Slack using `curl`:
        *   `-X POST`: Specifies the request method as POST.
        *   `-H 'Content-type: application/json'`: Sets the HTTP header to indicate the data being sent is in JSON format.
        *   `--data '{"text": "..."}'`: Provides the JSON payload containing the message text.
        *   `$SLACK_WEBHOOK_URL`: The secret incoming webhook URL provided by Slack. **This must be configured as a masked CI/CD variable in your GitLab project settings.**


