# CI/CD DevSecOps for React and Spring Boot Applications using GitLab

## React Application

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




---

## Spring Boot Application


# Overview

This is a DevSecOps task. In this task, we will implement an application, like a Spring app, with pipelines integrated with GitLab.
We will discuss the task needs, the problems encountered, the stages implemented, the variables used, and whether we used GitLab runners or a local runner.

# Task Needs

## Q1: CI/CD with DevSecOps for Spring Boot Application Using GitLab

---

This project implements a **secure and automated CI/CD pipeline** for a Spring Boot microservice using **GitLab CI/CD**, adhering to modern **DevSecOps practices**. It streamlines the entire development-to-deployment lifecycle by automating build, testing, security scanning, and deployment processes. Security is integrated at every stage of the pipeline to ensure a safe and reliable software delivery process.

---

### **Objectives:**

- Automate the CI/CD workflow for a Java Spring Boot application.
- Integrate **security scanning tools** to perform SAST, dependency, and container scans.
- Enable secure deployment to staging or production environments using **GitLab Runners**, **Docker**, or **Kubernetes**.

---

### **Pipeline Stages:**

1.  **Build Stage:**
    -   Compile Java code using **Maven** or **Gradle**.
2.  **Test Stage:**
    -   Execute unit and integration tests using **JUnit**.
3.  **SAST (Static Application Security Testing):**
    -   Analyze source code using **GitLab SAST** or **SonarQube**.
4.  **Dependency Scanning:**
    -   Scan for vulnerable third-party libraries using **OWASP Dependency-Check** or **Trivy**.
5.  **Container Scanning:**
    -   Check Docker image for known vulnerabilities using **Trivy** or GitLab's built-in scanning tools.
6.  **Deploy Stage:**
    -   Deploy the application to a Docker container, a staging environment, or **Kubernetes**.
7.  **DAST (Dynamic Application Security Testing) [Optional]:**
    -   Perform endpoint security testing using **OWASP ZAP**.

---

### **Tools & Stack:**

-   **Language:** Java (Spring Boot)
-   **Build Tool:** Maven / Gradle
-   **CI/CD:** GitLab CI/CD
-   **Security Tools:**
    -   **SAST:** GitLab SAST, SonarQube
    -   **Dependency Scanning:** OWASP Dependency-Check, Trivy
    -   **Container Scanning:** Trivy
    -   **DAST:** OWASP ZAP (optional)
-   **Testing:** JUnit, Postman/Newman (for API tests)
-   **Deployment:** Docker, Kubernetes, GitLab Runners

---

### **Outcome:**

The result is a **robust, secure, and fully automated CI/CD pipeline** that integrates best practices from the DevSecOps methodology. It enables rapid and secure delivery of Java-based applications, reducing manual effort, enhancing code quality, and mitigating security risks early in the development lifecycle.

# Runner

First, we will talk about the runner.
You can use the runner from GitLab itself, but after 400 minutes (Note: GitLab's free tier limits are typically based on CI/CD minutes, not number of times), you will need to buy more minutes or upgrade your plan. Alternatively, you can implement your local runner.
The local runner consists of types like the shell runner or the docker runner.
Of course, the docker runner is better than the shell runner.
I'll give you some links to implement your local runner based on Docker:

1.  First, you need to install Docker Desktop on your machine (this is if you are using Windows). From the link itself, you can see your OS and install the version that fits you: [https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)
    This is the link you need to install Docker.
2.  Next step, you need to install the runner from GitLab: [https://docs.gitlab.com/runner/install/](https://docs.gitlab.com/runner/install/). You can read the instructions to download and use it.
3.  Final step, just authenticate the runner with your GitLab account using a token. You can see how from the same link.

# Steps and Variables

*   First, I chose this site [https://start.spring.io/](https://start.spring.io/) to implement the app. Choose what you need from this site, but for me, I chose JAVA and MAVEN and Spring Boot 3.5.0v (Note: Specify the exact version, e.g., 3.3.0). The dependency I chose is Spring Web, which I'll work with using pipelines.
*   In the SAST step, I chose SonarCloud to check my app. First, go to this site [https://www.sonarsource.com/products/sonarcloud/](https://www.sonarsource.com/products/sonarcloud/) and make an account. It will ask you to integrate with your GitLab account that contains the code. Then, it will ask you to put 2 variables that will be used in the SAST stage. Finally, the site will give you the pipeline code; you will copy and paste it and use it.
*   When I used the GitLab runner, I didn't need to use `DOCKER_HOST: tcp://docker:2375` and `DOCKER_TLS_CERTDIR: ""`, but I used them after I switched to a local runner.
*   In DAST, I wanted to use the `owasp/zap2docker-stable` image, but I changed it to use a Docker image and call Trivy because the Docker image can log in and pull requests (Note: This statement seems contradictory or unclear. DAST typically uses ZAP, while Trivy is for container/dependency scanning. Clarification might be needed on the actual implementation).
*   In the deploy stage, you need to make 2 variables: one like the username of your Docker Hub account, and the other one is the token to allow the pipeline to get access to your account and push the image.
*   In the notify stage, you need to make a variable containing a token from Slack to make it send a message to your Slack account.

# Stages

## Build Stage

✅ **What is this stage for?**
This stage is called `build`.
It is used to build your Java program and create a `.jar` file from your code.

🧩 **Let's go line by line:**

🟦 `build:`
*   🔹 This is the name of the job.
*   You can call it anything, but we call it `build` because this job is for building the code.
*   🟨 **What if you remove this?**
    If you remove this, GitLab won’t know the job name. The job won't work.

🟦 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   🔹 This tells GitLab which runner to use.
*   Runners are machines that do the work.
*   This job will run on a runner that has the tag "docker".
*   🟨 **Why use this?**
    Because we want to run the job in a Docker container (a safe and clean environment).
*   🟨 **What if you remove this?**
    GitLab might say: "No runner found" if your runner needs tags.
    If your GitLab is using shared runners that don’t need tags, it may still work.

🟦 `stage: build`
*   🔹 This says that this job is part of the `build` stage of the pipeline.
*   GitLab pipelines have stages, like:
    *   build
    *   test
    *   deploy
*   🟨 **Why use this?**
    To tell GitLab when this job should run.
*   🟨 **What if you remove this?**
    GitLab may put this job in the default stage (the first one), or give an error. It's better to always specify the stage.

🟦 `image: maven:3.9.6-eclipse-temurin-17`
*   🔹 This tells GitLab:
    "Use this Docker image to run the job."
*   ✅ This image includes:
    *   Maven (a tool to build Java projects)
    *   Java 17 (Temurin is a distribution of Java)
*   🟨 **Why use this?**
    Because we are building a Java project, and we need Maven and Java to do that.
*   🟨 **What if you remove this?**
    The job may fail if the runner doesn’t have Maven or Java installed.
    Always use an image that has what you need.

🟦 `script:`
    ```yaml
    script:
      - mvn clean package -DskipTests
    ```
*   🔹 These are the commands to run inside the job.
*   This line tells Maven to:
    *   `clean`: delete old build files
    *   `package`: build the project and make the `.jar` file
    *   `-DskipTests`: skip running tests (for a faster build)
*   🟨 **Why use this?**
    Because we want to build the project quickly, without running tests in this specific stage.
*   🟨 **What if you remove this line?**
    The job will run but do nothing, or it will fail.
    If you remove `-DskipTests`, Maven will also run tests while building.

🟦 `artifacts:`
    ```yaml
    artifacts:
      paths:
        - target/*.jar
    ```
*   🔹 This tells GitLab:
    "After the build, save the `.jar` file from the `target/` folder."
*   🟨 **Why use this?**
    Because we need this `.jar` file in later jobs (like deploy or test).
    Artifacts are like shared files between stages.
*   🟨 **What if you remove this?**
    The build will still happen, but the `.jar` file will not be saved,
    so the next stage won’t find it and may fail.

## Test Stage

✅ **What is this stage for?**
It runs the command `mvn test` to execute unit tests in the Spring Boot project.
This helps to find bugs early, before deploying the app.

🧩 **Line-by-line breakdown:**

🟦 `test:`
*   🔹 This is the name of the job.
*   We call it `test` because it runs tests on the code.
*   🟨 **What if you remove this?**
    The job has no name, so GitLab will give an error.

🟦 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   🔹 This tells GitLab to use a runner that supports Docker (with the tag “docker”).
*   🟨 **Why?**
    Because this job runs inside a Docker container, just like the build job.
*   🟨 **What if you remove this?**
    If your GitLab runners need tags, the job will not run.
    If you use shared runners that don’t need tags, it might still work.

🟦 `dependencies:`
    ```yaml
    dependencies:
      - build
    ```
*   🔹 This tells GitLab:
    “Before running this test job, take the files (artifacts) from the `build` job.”
*   🟨 **Why?**
    Because the `.jar` file or compiled classes from the build stage are needed to run tests.
*   🟨 **What if you remove this?**
    The job may not find the files it needs, and it can fail.

🟦 `stage: test`
*   🔹 This says the job belongs to the `test` stage.
*   Pipelines usually go: build → test → deploy.
*   🟨 **Why?**
    So GitLab knows when to run this job in the pipeline.
*   🟨 **What if you remove this?**
    GitLab might place it in the wrong stage or give an error. It's better to keep it.

🟦 `image: maven:3.9.6-eclipse-temurin-17`
*   🔹 This tells GitLab to use a Docker image that includes:
    *   Maven (for Java builds/tests)
    *   Java 17 (needed to run your code)
*   🟨 **Why?**
    We need Java and Maven to run the tests.
*   🟨 **What if you remove this?**
    The job may fail if the runner doesn't already have Maven and Java.

🟦 `script:`
    ```yaml
    script:
      - mvn test
    ```
*   🔹 This is the command that tells Maven:
    “Run all the test files.”
*   ✅ Maven will look for test files (like JUnit tests) and run them.
*   🟨 **Why use this?**
    So we can check if the code works correctly and doesn’t have bugs.
*   🟨 **What if you remove this?**
    The job will do nothing, or fail.
    No tests will run, which is bad for quality and security.

🟦 `artifacts:`
    ```yaml
    artifacts:
      when: always
      reports:
        junit: target/surefire-reports/TEST-*.xml
    ```
*   🔹 These lines save the test results, even if tests fail.
*   Let’s break it down:
    *   🔸 `when: always`
        👉 Always keep the test report, even if tests fail.
    *   🔸 `reports:`
        👉 This tells GitLab this is a test report.
    *   🔸 `junit: target/surefire-reports/TEST-*.xml`
        👉 GitLab will look in this folder for test results in JUnit XML format.
*   🟨 **Why?**
    So GitLab can show a pretty test report on the pipeline UI.
*   🟨 **What if you remove this?**
    If you remove `artifacts`, you won’t see test results in GitLab.
    If tests fail, it’s harder to know what went wrong.

## SAST Stage

✅ **What is this stage for?**
This job does SAST: Static Application Security Testing.
It means it reads the code line-by-line and finds problems like:

*   Bugs
*   Bad code quality
*   Security issues

It uses a tool called SonarCloud, which works with Java projects.

🧩 **Line-by-line breakdown**

🟦 `variables:`
    ```yaml
    variables:
      SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"
      GIT_DEPTH: "0"
    ```
*   🔸 `SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"`
    👉 This tells SonarCloud:
    “Save your temporary files here.”
*   🟨 **Why?**
    To cache data and make the job faster next time.
*   🟨 **What if you remove this?**
    The job might still work, but it will be slower every time.

*   🔸 `GIT_DEPTH: "0"`
    👉 This tells Git:
    “Fetch the whole project history, not just the latest change.”
*   🟨 **Why?**
    Sonar needs full Git info (like old commits) to analyze the code correctly.
*   🟨 **What if you remove this?**
    SonarCloud might give errors like “can’t find previous commit” or miss issues.

🟦 `sonarcloud-check:`
*   👉 This is the name of the job.
*   We call it this because it runs SonarCloud checks.

🟦 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   👉 Use a runner that supports Docker.
*   🟨 **Why?**
    Because this job runs in a Docker container.
*   🟨 **What if removed?**
    If your runners require tags, the job won’t run.

🟦 `dependencies:`
    ```yaml
    dependencies:
      - test
    ```
*   👉 This job depends on the `test` job. It may need files or test results.
*   🟨 **What if removed?**
    If Sonar needs test reports and can’t find them, the analysis might be incomplete.

🟦 `stage: sast`
*   👉 This job belongs to the `sast` stage (Static Application Security Testing).
*   🟨 **Why?**
    To run after `test`, and before deployment.

🟦 `image: maven:3.9.6-eclipse-temurin-17`
*   👉 Use a Docker image that has Java 17 and Maven — so we can build and analyze the code.
*   🟨 **What if removed?**
    The runner may not have Java or Maven — the job will fail.

🟦 `cache:`
    ```yaml
    cache:
      key: "${CI_JOB_NAME}"
      paths:
        - .sonar/cache
    ```
*   👉 Save the `.sonar/cache` folder for this job.
*   🟨 **Why?**
    To reuse files and make the job faster in the next run.
*   🟨 **What if removed?**
    The job works, but every run will be slow (downloads everything again).

🟦 `script:`
    ```yaml
    script:
      - mvn verify sonar:sonar -Dsonar.projectKey=tarek_tarek
    ```
*   👉 This is the main command that does:
    *   `mvn verify`: Builds the code and runs tests
    *   `sonar:sonar`: Sends the code to SonarCloud
    *   `-Dsonar.projectKey=tarek_tarek`: Uses your SonarCloud project key (replace `tarek_tarek` with your actual key)
*   🟨 **What if removed?**
    No code will be analyzed. The job will do nothing.

🟦 `only:`
    ```yaml
    only:
      - merge_requests
      - main
      - develop
    ```
*   👉 This job will run only for:
    *   Pull/Merge Requests (when someone wants to merge code)
    *   The `main` and `develop` branches (adjust to your branch names)
*   🟨 **Why?**
    You don’t need to analyze every small branch — just the important ones.
*   🟨 **What if removed?**
    The job might run on all branches, which is too much work.

## Dependency Scan Stage

✅ **What is this stage for?**
This job does Dependency Scanning.
👉 It checks all the Java libraries your project uses (from `pom.xml`) and tells you:
“Hey! This library has a vulnerability, you should update it!”
This helps you fix security issues before they become a problem.

🧩 **Line-by-line explanation**

🔹 `dependency-check:`
*   This is just the name of the job. You can call it anything.

🔹 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   👉 This tells GitLab:
    “Use a runner that supports Docker.”
*   🟨 **Why?**
    Because we are using a Docker image below.
*   🟨 **What if removed?**
    If your GitLab runner needs tags, the job won’t run.

🔹 `dependencies:`
    ```yaml
    dependencies:
      - build
    ```
*   👉 This job depends on the `build` job. It may need files from there.
*   🟨 **Why?**
    Because the code must be built first (specifically, the dependencies downloaded) to be scanned properly.
*   🟨 **What if removed?**
    The scan might miss files or fail if the code wasn’t built or dependencies weren't available.

🔹 `stage: dependancy-scan` (Note: Consider renaming to `dependency-scan` for consistency)
*   👉 This tells GitLab:
    “This job belongs to the `dependancy-scan` stage.”
*   🟨 **Why?**
    Helps GitLab organize jobs in order: build → test → scan → deploy

🔹 `image:`
    ```yaml
    image:
      name: owasp/dependency-check:latest
      entrypoint: [""]
    ```
*   👉 This tells GitLab to run the job using a special Docker image made by OWASP.
*   It has a tool called `dependency-check` inside it.
*   🟨 `entrypoint: [""]`
    This tells GitLab:
    “Don’t run any default command in the image — just run my script.”
*   🟨 **Why is that important?**
    Some Docker images auto-run something when they start. This stops that, ensuring your `script` commands are executed.
*   🟨 **What if removed?**
    The job might crash or run the wrong thing by mistake if the image's default entrypoint conflicts with your script.

🔹 `script:`
    ```yaml
    script:
      - /usr/share/dependency-check/bin/dependency-check.sh --project "TarekProject" --scan "${CI_PROJECT_DIR}" --format "HTML" --out "${CI_PROJECT_DIR}/dependency-check-report"
    ```
*   👉 This is the main command to scan your code.
*   Let's break it down:
    *   `/usr/share/dependency-check/bin/dependency-check.sh` → the scanning tool.
    *   `--project "TarekProject"` → name for the report
    *   `--scan "${CI_PROJECT_DIR}"` → scan the whole project directory
    *   `--format "HTML"` → create a nice HTML report
    *   `--out "${CI_PROJECT_DIR}/dependency-check-report"` → save the report in a folder named `dependency-check-report`
*   🟨 **What if removed?**
    Nothing will be scanned. The job does nothing without this line.

🔹 `artifacts:`
    ```yaml
    artifacts:
      when: always
      paths:
        - dependency-check-report
    ```
*   👉 This tells GitLab to save the scan report after the job finishes.
*   🔸 `when: always`
    “Save the report even if the scan failed!”
*   🔸 `paths:`
    “Save everything inside the `dependency-check-report/` folder.”
*   🟨 **Why?**
    So you can download and read the report later from GitLab.
*   🟨 **What if removed?**
    You will not see the scan results — the report is lost.

*** The most significant problem that I faced in this stage was that I didn't write `entrypoint: [""]`, and this prevented the script I wrote from being executed.

## Container Build Stage

🚀 **What is this job for?**
This job makes a Docker image from your app.
Then it saves this image to a file (`image.tar`).
You can reuse this file later (e.g., to push it, scan it, or deploy it).
💡 Think of it like:
“Take my app code 🧾, turn it into a container 📦, and save it to share later.”

🔍 **Let's explain each line**

🔹 `docker-build:`
*   This is the name of the job. You can name it anything.

🔹 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   ➡️ This tells GitLab:
    “Please use a runner that supports Docker.”
*   🟨 **Why?**
    Because this job needs to build Docker images.
*   🟨 **What if removed?**
    The job may not run if your runners need tags.

🔹 `dependencies:`
    ```yaml
    dependencies:
      - build
    ```
*   ➡️ This job uses the output (artifact) from the `build` stage.
*   So it waits until `mvn package` (in the `build` job) is finished.
*   🟨 **Why?**
    Because we build the `.jar` file first → then put it in the Docker image (usually via a `Dockerfile`).
*   🟨 **What if removed?**
    You may miss files (like the `.jar`) or get an error if the `build` job artifact is not available.

🔹 `stage: container-build`
*   Tells GitLab:
    “This job is part of the `container-build` stage.”

🔹 `image: docker:latest`
*   ➡️ This job runs inside a Docker environment (using the official `docker:latest` image).
*   So we can use the `docker` command.
*   🟨 **What if removed?**
    You won’t have the `docker` command → the job will fail.

🔹 `services:`
    ```yaml
    services:
      - name: docker:dind
        alias: docker
    ```
*   ➡️ This starts another helper container beside your job.
*   This one is Docker-in-Docker (`dind`).
*   It lets you build Docker images inside GitLab’s pipeline.
*   🟨 **Why?**
    Docker normally doesn’t work inside another container unless we use this trick (or mount the host's Docker socket, which is another method).
*   🟨 **What if removed?**
    You will likely get a: ❌ “Cannot connect to Docker daemon” error.

🔹 `variables:`
    ```yaml
    variables:
      DOCKER_HOST: tcp://docker:2375
      DOCKER_TLS_CERTDIR: ""
    ```
*   ✅ `DOCKER_HOST: tcp://docker:2375`
    This tells the Docker client where to find the `dind` service (using the service alias `docker`).
*   ✅ `DOCKER_TLS_CERTDIR: ""`
    This disables security (TLS) for the connection between the job container and the `dind` service container.
    💡 We only do this for communication between these internal containers, not for external connections.
*   🟨 **What if removed?**
    GitLab may not connect to the Docker daemon correctly → the build fails.

🔹 `script:`
    ```yaml
    script:
      - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA .
      - docker save $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA -o image.tar
    ```
*   ✅ `docker build ...`
    This builds the Docker image using the `Dockerfile` in the current directory (`.`).
*   Let’s break down the tag (`-t`):
    *   `$CI_REGISTRY_IMAGE`: Your GitLab project's container registry path (e.g., `registry.gitlab.com/yourgroup/yourproject`)
    *   `$CI_COMMIT_REF_SLUG`: The branch or tag name (e.g., `main`, `dev`, `v1-0`)
    *   `$CI_COMMIT_SHORT_SHA`: The short commit ID (e.g., `abc1234`)
*   🟨 Example image tag:
    `registry.gitlab.com/mygroup/myproject:main-abc1234`
*   ✅ `docker save ...`
    This saves the built Docker image as a `.tar` file.
*   🟨 **Why?**
    Because we can pass this file as an artifact to another job (like scan or deploy).
*   🟨 **What if removed?**
    The image won’t be saved as a file. You can’t reuse it easily in later stages via artifacts (though you could push it to a registry here and pull it later).

🔹 `artifacts:`
    ```yaml
    artifacts:
      paths:
        - image.tar
    ```
*   ➡️ This tells GitLab to save the `image.tar` file after the job.
*   🟨 **Why?**
    So you can use it in the next job, like scanning or deploying, by declaring a dependency.
*   🟨 **What if removed?**
    You will lose the `image.tar` file — other jobs can’t use it as an artifact.

## Container Scan Stage

🔍 **What does this job do?**
This job checks the Docker image (that we built and saved as `image.tar`) for security problems (vulnerabilities).
It uses a tool called Trivy 🔍.
Trivy is a scanner that looks inside the Docker image and says:
“Hey! Your app or its base image has problems 🚨. You should fix them!”

💡 **Simple idea**
“I have a Docker image (`image.tar`) 🧱.
I want to scan it 🔎 and create a report 📄.
And if there are big problems (HIGH or CRITICAL), I want the job to fail (or at least warn me) ❗”

🔍 **Line-by-line explanation**

🔹 `docker-scan:`
*   This is the name of the job. You can call it anything.

🔹 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   ✅ Use a runner that supports Docker.
*   🟨 **If removed:**
    The job may not run if GitLab needs this tag to match the runner.

🔹 `dependencies:`
    ```yaml
    dependencies:
      - docker-build
    ```
*   ✅ This tells GitLab:
    “Wait for the `docker-build` job first, because I need the `image.tar` file artifact.”
*   🟨 **If removed:**
    You may get an error like “file not found” 😢 because `image.tar` isn't there yet.

🔹 `stage: container-scan`
*   This is just a label to group jobs.
*   This job is part of the `container-scan` stage.

🔹 `image:`
    ```yaml
    image:
      name: aquasec/trivy:latest
      entrypoint: [""]
    ```
*   ✅ GitLab will use a container that already has Trivy installed (`aquasec/trivy:latest`).
*   🛑 `entrypoint: [""]` = disable the default startup command.
    (We want to use our own `trivy` commands from the `script` section.)
*   🟨 **If removed:**
    Trivy might not run correctly, or the job may crash if the default entrypoint conflicts.

🔹 `script:`
    ```yaml
    script:
      - trivy image --input image.tar --format template --template "@/contrib/html.tpl" --output trivy-report.html
      - trivy image --input image.tar --severity HIGH,CRITICAL --exit-code 1 || echo "There are high severity vulnerabilities"
    ```
*   ✅ **Line 1:**
    `trivy image --input image.tar --format template --template "@/contrib/html.tpl" --output trivy-report.html`
    🧠 **What it means:**
    *   `trivy image` → scan a Docker image.
    *   `--input image.tar` → read the image from the file we built earlier.
    *   `--format template` → use a custom format for the output.
    *   `--template "@/contrib/html.tpl"` → use Trivy's built-in HTML template to generate a report.
    *   `--output trivy-report.html` → save the report to a file named `trivy-report.html`.
    💡 This line creates a pretty HTML report to show security problems.

*   ✅ **Line 2:**
    `trivy image --input image.tar --severity HIGH,CRITICAL --exit-code 1 || echo "There are high severity vulnerabilities"`
    🧠 **What it means:**
    *   Scan the image again (`trivy image --input image.tar`).
    *   Report only `HIGH` and `CRITICAL` severity problems (`--severity HIGH,CRITICAL`).
    *   If any such problems are found, exit with code 1 (`--exit-code 1`), which normally fails the GitLab job.
    *   However, we add `|| echo "..."`. The `||` means: if the command on the left fails (exits with non-zero code), then run the command on the right (`echo`). This prevents the job from failing immediately but still prints a warning message.
    💡 **So:**
    *   If the scan finds no HIGH/CRITICAL issues ✅ → the `trivy` command exits with 0, the `echo` is skipped, and the job passes (assuming the first scan also passed).
    *   If the scan finds HIGH/CRITICAL issues ❌ → the `trivy` command exits with 1, the `echo` command runs (printing the warning), and the job *still passes* because the `echo` command itself succeeds (exit code 0). If you want the job to *fail* on critical issues, remove the `|| echo "..."` part.

*   🟨 **Why use 2 scans?**
    *   One scan is to generate a full report (HTML in this case) 📝.
    *   The other scan is specifically to check if serious problems exist and potentially control the job's success/failure status 🔥.

*   🟨 **If the second line is removed?**
    You will only get the report, but the pipeline will not automatically indicate (e.g., by failing or warning in the log) if your app has dangerous vulnerabilities based on severity.

🔹 `artifacts:`
    ```yaml
    artifacts:
      when: always
      paths:
        - trivy-report.html
    ```
*   ✅ Keep the report file (`trivy-report.html`) even if the job fails (`when: always`).
*   🟨 **Why?**
    So we can open the HTML file and see the scan results, regardless of the job's outcome.
*   🟨 **If removed?**
    The report will be lost — you won’t know what vulnerabilities were found.

## Deploy Stage

🧩 **Total Role (What this stage does)**
This `deploy` stage takes the Docker image (which was built and scanned), loads it, tags it appropriately, and sends (pushes) it to a container registry like Docker Hub.
So, other people or servers can pull the image from the registry and run your app.

🔍 **Now Line-by-Line Explanation**

🔸 `deploy:`
*   This is the name of the job.
*   We call it `deploy` because this job will deploy the app's image.
*   🧠 **If you remove or change this name:**
    Nothing breaks technically, but the name will change in the GitLab UI.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   This tells GitLab to run this job on a runner that has the `docker` tag.
*   🧠 **Why we use it:**
    We need Docker installed on the runner to run Docker commands (`load`, `login`, `tag`, `push`).
*   🧠 **If you remove it:**
    GitLab might not find a suitable runner with Docker. The job may fail to start.

🔸 `dependencies:`
    ```yaml
    dependencies:
      - docker-build
    ```
*   This says:
    “I need the artifact (`image.tar`) from the `docker-build` job before I start.”
*   🧠 **Why we use it:**
    We need the `image.tar` file that was built and saved in the `docker-build` stage.
*   🧠 **If you remove it:**
    The job won’t have the image file artifact, and `docker load` will fail.

🔸 `stage: deploy`
*   This tells GitLab:
    “This job belongs to the `deploy` stage.”
*   🧠 **Why we use it:**
    GitLab runs jobs in stage order (e.g., build → test → scan → deploy). This keeps things organized.
*   🧠 **If you remove it:**
    GitLab won’t know when to run this job relative to others. It may fail or run at the wrong time.

🔸 `image: docker:latest`
*   We use a Docker image that has the Docker client tools inside it.
*   🧠 **Why we use it:**
    So we can run Docker commands in the `script` section.
*   🧠 **If you remove it:**
    Docker commands won’t work. The job will crash.

🔸 `services:`
    ```yaml
    services:
      - name: docker:dind
        alias: docker
    ```
*   This means:
    “Start a Docker daemon service (Docker-in-Docker) next to the job.”
*   🧠 **Why we use it:**
    The Docker client in the `image` needs a Docker daemon to connect to. `dind` provides this.
*   🧠 **If you remove it:**
    Docker commands won’t work. It will say: "Cannot connect to Docker daemon".

🔸 `variables:`
    ```yaml
    variables:
      DOCKER_HOST: tcp://docker:2375
      DOCKER_TLS_CERTDIR: ""
    ```
*   `DOCKER_HOST`: tells the Docker client where to find the Docker daemon service (using the alias `docker`).
*   `DOCKER_TLS_CERTDIR`: disables TLS for this internal connection.
*   🧠 **Why we use it:**
    So the Docker client knows where to send commands.
*   🧠 **If you remove them:**
    The Docker client won’t connect correctly. Commands will fail.

🔸 `script:`
*   Now the real action starts! Each line is a command run in the job.

*   🟠 `docker load -i image.tar`
    👉 Loads the Docker image from the file called `image.tar` (which came from the `docker-build` artifact).
*   🧠 **Why:**
    The image was built and saved before; now we load it into the Docker daemon running in the `dind` service so we can tag and push it.
*   🧠 **If removed:**
    The next commands won't find the image. Tag and push will fail.

*   🟠 `docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"`
    👉 Logs in to Docker Hub using the username and password stored in GitLab CI/CD variables (`$DOCKER_USERNAME`, `$DOCKER_PASSWORD`). **Remember to set these variables in your GitLab project settings!**
*   🧠 **Why:**
    You must log in before you can push images to a private repository or often even to a public one on Docker Hub.
*   🧠 **If removed:**
    `docker push` will likely fail. You’ll get an “authentication required” or “not authorized” error.

*   🟠 `docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA $DOCKER_HUB_REPO:latest`
    👉 Takes the image (which was loaded and has a GitLab-specific tag like `registry.gitlab.com/mygroup/myproject:main-abc1234`) and gives it an additional tag suitable for Docker Hub (e.g., `yourdockerhubuser/yourrepo:latest`). `$DOCKER_HUB_REPO` should be another CI/CD variable you set (e.g., `yourdockerhubuser/yourrepo`).
*   🧠 **Why:**
    You need to tag an image with the desired repository name and tag before you can push it to Docker Hub.
*   🧠 **If removed:**
    Docker won’t know what name to use when pushing to Docker Hub. The push command will fail or push the wrong thing.

*   🟠 `docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA $DOCKER_HUB_REPO:$CI_COMMIT_SHORT_SHA`
    👉 Adds another tag to the same image, this time using the short commit SHA (e.g., `yourdockerhubuser/yourrepo:abc1234`).
*   🧠 **Why:**
    This allows you to track each specific version of your app image pushed to Docker Hub. The `latest` tag points to the most recent push, while the commit SHA tag points to a specific build.
*   🧠 **If removed:**
    You lose the ability to push and track this specific version by its commit ID. Only the `latest` tag will be pushed (from the previous command).

*   🟠 `docker push $DOCKER_HUB_REPO:latest`
    👉 Sends the image tagged as `latest` to Docker Hub.
*   🧠 **Why:**
    This updates the `latest` tag in your Docker Hub repository, which is often what users or systems pull by default.
*   🧠 **If removed:**
    Only the specific version (tagged with the commit SHA) will be pushed, not the general "latest" one.

*   🟠 `docker push $DOCKER_HUB_REPO:$CI_COMMIT_SHORT_SHA`
    👉 Sends the image tagged with the short commit ID (e.g., `abc1234`) to Docker Hub.
*   🧠 **Why:**
    This ensures the specific version associated with this commit is available in the registry.
*   🧠 **If removed:**
    You won’t be able to access this specific version from Docker Hub using its commit tag.

## DAST Stage

🧩 **Total Role (What does this DAST job do?)**
`dast` = Dynamic Application Security Testing.
This stage typically involves:
1.  Starting your application in a temporary environment (like a Docker container).
2.  Running a security scanning tool (like OWASP ZAP) against the *running* application to find vulnerabilities by interacting with it as a user would.

✅ This job helps ensure your running application is not easily hacked by actively probing it for common web vulnerabilities.

🔍 **Line-by-Line Simple Explanation (Based on the provided ZAP example)**

🔸 `tarek-dast:` (Assuming this is the job name from the original text)
*   This is the name of the job.
*   🧠 **If you remove or rename it:**
    Just the job name changes in GitLab. No technical issue.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   This says: “Run this job on a machine that has Docker.”
*   🧠 **If removed:**
    GitLab might not find the right runner. The job may not run.

🔸 `dependencies:`
    ```yaml
    dependencies:
      - docker-build
    ```
*   This job needs the image artifact (`image.tar`) created by `docker-build` to run the application.
*   🧠 **If removed:**
    The image may not be available, so `docker load` or `docker run` might fail.

🔸 `stage: tarek-dast` (Or a standard name like `dast`)
*   This job is part of a stage named `tarek-dast`.
*   🧠 **If removed:**
    GitLab won’t know the job order. The job may run at the wrong time.

🔸 `image:`
    ```yaml
    image:
      name: docker:latest
      entrypoint: [""]
    ```
*   `name: docker:latest` → Use an image with Docker tools.
*   `entrypoint: [""]` → Run script commands directly.
*   🧠 **If removed:**
    Without `docker`, we can't use Docker commands.
    Without `entrypoint`, the script might not run as expected.

🔸 `services:`
    ```yaml
    services:
      - name: docker:dind
        alias: docker
    ```
*   Start a Docker daemon service next to the job.
*   🧠 **Why:**
    We need to run Docker commands (like `docker run` for the app and the ZAP scanner).
*   🧠 **If removed:**
    All Docker commands will fail.

🔸 `variables:`
    ```yaml
    variables:
      DOCKER_HOST: tcp://docker:2375
      DOCKER_TLS_CERTDIR: ""
    ```
*   Tells the Docker client where to connect to the `dind` service.
*   Disables TLS for this internal connection.
*   🧠 **If removed:**
    The Docker client won’t connect. Commands will fail.

🔸 `script:`
*   This is the list of steps to run inside the job.

*   🟠 `mkdir -p zap-wrk`
    👉 Make a directory named `zap-wrk` (if it doesn't already exist).
*   🧠 **Why:**
    ZAP will save its reports inside this folder.
*   🧠 **If removed:**
    The later `docker run` command for ZAP might fail if the volume mount path doesn't exist, or ZAP might crash if it can't write reports.

*   🟠 `chmod 777 zap-wrk`
    👉 Give full read/write/execute permissions to the `zap-wrk` folder for all users.
*   🧠 **Why:**
    The ZAP process running inside its Docker container needs permission to write reports to this directory, which is mounted from the host job environment.
*   🧠 **If removed:**
    ZAP inside Docker may not be able to write the report. You might get permission errors.

*   🟠 `docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"`
    👉 Logs in to Docker Hub (or your registry).
*   🧠 **Why:**
    Needed if the application image (`$DOCKER_HUB_REPO:latest`) is in a private repository.
*   🧠 **If removed:**
    `docker pull` might fail if the repo is private.

*   🟠 `docker pull $DOCKER_HUB_REPO:latest`
    👉 Download the latest image of your app from the registry.
*   🧠 **Why:**
    Ensures the most recent image is used, even if it wasn't the one just built (though often you'd use the image from `image.tar` via `docker load`).
*   🧠 **If removed:**
    The next line (`docker run`) might fail if the image is not already available locally in the `dind` service.

*   🟠 `docker run -d --name tarek-dast -p 8080:8080 $DOCKER_HUB_REPO:latest`
    👉 Start your application container.
    *   `-d`: Run in detached mode (in the background).
    *   `--name tarek-dast`: Give the container a specific name.
    *   `-p 8080:8080`: Map port 8080 on the host (the job environment) to port 8080 inside the container (assuming your Spring Boot app runs on 8080).
    *   `$DOCKER_HUB_REPO:latest`: The image to run.
*   🧠 **If removed:**
    You can't scan anything because no application is running.

*   🟠 `sleep 5 && docker inspect tarek-dast --format '{{.State.ExitCode}}'`
    👉 Wait 5 seconds, then check the exit code of the container named `tarek-dast`. (Note: This check might be too early and doesn't guarantee the app is *ready*, only that the container *started* without immediate failure).
*   🧠 **If removed:**
    You proceed without a basic check that the container started.

*   🟠 `for i in {1..60}; do ... done` (Original text implies a loop here, checking reachability)
    👉 This loop attempts to connect to the application (e.g., using `curl http://localhost:8080`) up to 60 times, waiting a second or two between tries. It exits the loop once the application responds successfully.
*   🧠 **Why:**
    Ensures the application is fully started and ready to receive requests before the ZAP scan begins.
*   🧠 **If removed:**
    ZAP might start scanning while the app is still initializing, leading to an incomplete or failed scan.

*   🟠 `docker run -v $(pwd)/zap-wrk:/zap/wrk --network container:tarek-dast zaproxy/zap-stable zap-baseline.py -t "http://localhost:8080" -g gen.conf -r report.html -w report.md -J report.json || true`
    👉 Run the OWASP ZAP baseline scan in a Docker container.
    *   `-v $(pwd)/zap-wrk:/zap/wrk`: Mount the `zap-wrk` directory from the job environment into `/zap/wrk` inside the ZAP container so reports can be saved.
    *   `--network container:tarek-dast`: Connect the ZAP container directly to the network stack of the application container (`tarek-dast`). This allows ZAP to access the app via `http://localhost:8080`.
    *   `zaproxy/zap-stable`: The ZAP Docker image.
    *   `zap-baseline.py`: The script to run the baseline scan.
    *   `-t "http://localhost:8080"`: The target URL to scan.
    *   `-g gen.conf`: Generate a configuration file (optional).
    *   `-r report.html -w report.md -J report.json`: Specify the report formats and filenames to be saved in `/zap/wrk`.
    *   `|| true`: If the ZAP scan finds vulnerabilities and exits with a non-zero code, the `|| true` ensures the GitLab job itself doesn't fail.
*   🧠 **If removed:**
    You won’t test your running application for security issues.
*   🧠 **Why `|| true`?**
    To prevent the pipeline from stopping just because ZAP found issues. You might want to review the report first. Remove `|| true` if you want the job to fail when ZAP finds vulnerabilities.

*   🟠 `cp zap-wrk/report.html zap-wrk/report.md zap-wrk/report.json . || true`
    👉 Copy the generated reports from the `zap-wrk` subdirectory to the current working directory (`.`).
*   🧠 **Why:**
    The `artifacts` section usually looks for files in the main job directory. This makes the reports available for artifact upload.
*   🧠 **If removed:**
    The `artifacts` section might not find the files in the subdirectory, and they won’t be uploaded.

🔸 `artifacts:`
    ```yaml
    artifacts:
      when: always
      paths:
        - report.html
        - report.md
        - report.json
    ```
*   👉 Save the ZAP scan reports after the job finishes.
*   `when: always` = save even if the job fails.
*   `paths:` = list of files to save.
*   🧠 **If removed:**
    You won't be able to download the DAST reports from GitLab.

## Cleanup Stage

🧩 **Total Role (What does cleanup do?)**
This job is for cleaning up after the pipeline (or specific stages) finishes.
In this example, it deletes the `image.tar` file to keep the workspace clean.

✅ This is like tidying up your workspace after finishing your work.

🔍 **Line-by-Line Simple Explanation**

🔸 `cleanup:`
*   This is the name of the job.
*   🧠 **If you change it:**
    Only the name changes. It still works.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tells GitLab to run this job on a runner that supports Docker (or any runner if the commands don't require Docker).
*   🧠 **If removed:**
    If the runner doesn't match (and tags are required), the job may not run.

🔸 `stage: cleanup`
*   This job belongs to the `cleanup` stage. It usually runs last or after specific resource-intensive stages.
*   🧠 **If removed:**
    GitLab won’t know when to run the job. It might run at the wrong time.

🔸 `image: alpine:latest`
*   Use the `alpine:latest` image.
*   Alpine is a very small and fast Linux image.
*   🧠 **Why:**
    We just want to run a simple command (`rm`) to delete a file. Alpine is lightweight and sufficient for this.
*   🧠 **If removed:**
    GitLab won’t know which OS or environment to use. The job might fail if the default runner environment doesn't have the `rm` command or access to the workspace.

🔸 `script:`
*   List of steps to run.

*   🟠 `echo "Cleaning up..."`
    👉 Just prints this message to the job log.
*   🧠 **Why:**
    So we know the cleanup job started.
*   🧠 **If removed:**
    No problem. It’s just for humans to see.

*   🟠 `rm -f image.tar`
    👉 Delete the file `image.tar`.
    *   `-f` means “force” (don’t ask for confirmation, and don’t show an error if the file is already missing).
*   🧠 **Why:**
    To free up disk space in the runner's workspace. To clean up intermediate files that are no longer needed. To avoid saving unnecessary large files as artifacts if workspace caching is enabled.
*   🧠 **If removed:**
    The file stays in the workspace. This might not cause an error, but it wastes space and could potentially interfere with subsequent runs if not handled correctly.

## Notify Stage

🧩 **Total Role (What does slack-notify do?)**
This job sends a message to Slack (a team chat application).
In this example, it sends a message like: ✅ "The task is done successfully."

✅ This job is like sending a notification to your team saying: “The pipeline finished!”

🔍 **Line-by-Line Simple Explanation**

🔸 `slack-notify:`
*   This is the name of the job.
*   🧠 **If you change it:**
    Only the name changes. It still works.

🔸 `tags:`
    ```yaml
    tags:
      - docker
    ```
*   Tells GitLab to use a runner that supports Docker (needed for the `curlimages/curl` image).
*   🧠 **If removed:**
    GitLab might not find a correct machine to run this if tags are required.

🔸 `dependencies:`
    ```yaml
    dependencies:
      - deploy
    ```
*   This job depends on the `deploy` job.
*   It waits for `deploy` to finish successfully before running.
*   🧠 **If removed:**
    The notification message might be sent even if the deployment failed, or before it finishes.

🔸 `stage: notify`
*   This job is part of the `notify` stage (used for sending notifications).
*   🧠 **If removed:**
    GitLab won’t know when to run it relative to other stages. It might run at the wrong time.

🔸 `image: curlimages/curl:latest`
*   This uses a Docker image that only contains the `curl` tool.
*   🧠 **Why:**
    We use `curl` to send the HTTP POST request to the Slack webhook URL.
*   🧠 **If removed:**
    The job may fail because the `curl` command won’t be found in the default runner environment.

🔸 `script:`
*   List of things to do in this job.

*   🟠 `curl -X POST -H 'Content-type: application/json' --data '{"text":"Deployment successful!"}' $SLACK_WEBHOOK_URL`
    👉 This line sends a message to Slack using a webhook URL.
    *   `curl` → the command to send data.
    *   `-X POST` → specifies that we are sending data (using the HTTP POST method).
    *   `-H 'Content-type: application/json'` → sets the header to tell Slack we are sending data in JSON format.
    *   `--data '{"text":"Deployment successful!"}'` → the actual message content in JSON format. You can customize the text.
    *   `$SLACK_WEBHOOK_URL` → the secret URL provided by Slack for receiving messages. **Store this as a masked CI/CD variable in GitLab settings!**
*   🧠 **Why:**
    To automatically inform your team via Slack that the pipeline (specifically the deployment in this case) has finished successfully.
*   🧠 **If removed:**
    No Slack message will be sent. People won’t know the task finished unless they check GitLab manually.

