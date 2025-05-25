# CI/CD with DevSecOps for a Spring Boot Application using GitLab

## Introduction

This document outlines a task focused on implementing a secure and automated CI/CD pipeline for a Spring Boot microservice using GitLab CI/CD, adhering to modern DevSecOps practices.

- **Author:** Tarek Adel (DevSecOps Engineer)
- **LinkedIn:** [https://www.linkedin.com/in/tarek-adel-857279197/](https://www.linkedin.com/in/tarek-adel-857279197/)

## Task Overview

The primary goal is to establish a robust CI/CD pipeline that streamlines the development-to-deployment lifecycle for a Spring Boot application. This involves automating the build, testing, security scanning, and deployment processes. A key aspect is integrating security checks at every stage of the pipeline (DevSecOps) to ensure a safe and reliable software delivery process.

## Objectives

- Automate the complete CI/CD workflow for the Java Spring Boot application.
- Integrate various security scanning tools to perform Static Application Security Testing (SAST), dependency scanning, and container image scanning.
- Enable secure and automated deployment to staging or production environments using technologies like Docker or Kubernetes, orchestrated via GitLab Runners.

## Tools and Technology Stack

- **Programming Language:** Java (Spring Boot Framework)
- **Build Tool:** Maven or Gradle
- **CI/CD Platform:** GitLab CI/CD
- **Security Scanning Tools:**
    - **SAST:** GitLab SAST, SonarQube
    - **Dependency Scanning:** OWASP Dependency-Check, Trivy
    - **Container Scanning:** Trivy, GitLab Container Scanning
    - **DAST (Optional):** OWASP ZAP
- **Testing Frameworks:** JUnit (Unit/Integration), Postman/Newman (API Tests)
- **Deployment Targets:** Docker, Kubernetes, managed via GitLab Runners

## GitLab Runners

GitLab CI/CD jobs are executed by Runners. You have several options:

1.  **GitLab Shared Runners:** Provided by GitLab (free tier has usage limits).
2.  **Self-Hosted Runners:** Runners you install and manage on your own infrastructure.

For self-hosted runners, common types include:

-   **Shell Executor:** Runs jobs directly on the host machine.
-   **Docker Executor:** Runs jobs in isolated Docker containers (Recommended for consistency and security).

**Setting up a Local Docker Runner:**

1.  **Install Docker:** Follow the official documentation for your OS (e.g., [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/)).
2.  **Install GitLab Runner:** Download and install the GitLab Runner software following the [official installation guide](https://docs.gitlab.com/runner/install/).
3.  **Register the Runner:** Link the installed runner to your GitLab instance or project using a registration token obtained from your GitLab settings. Configure it to use the Docker executor.

## Implementation Notes and Variables

-   **Application Setup:** The sample Spring Boot application can be initialized using [Spring Initializr](https://start.spring.io/). Key choices for this task include Java, Maven, Spring Boot 3.5.0 (or desired version), and the `Spring Web` dependency.
-   **SAST Configuration (SonarCloud):**
    -   Create an account on [SonarCloud](https://www.sonarsource.com/products/sonarcloud/).
    -   Integrate your SonarCloud account with the GitLab repository containing the code.
    -   Configure the following GitLab CI/CD variables (masked recommended) in your project settings:
        -   `SONAR_TOKEN`: Your SonarCloud user token.
        -   `SONAR_HOST_URL`: Typically `https://sonarcloud.io`.
    -   SonarCloud will provide a `.gitlab-ci.yml` snippet to include in your SAST stage.
-   **Local Runner Variables:** When using a self-hosted Docker runner with Docker-in-Docker (dind), you often need these variables defined in jobs that build/run containers:
    -   `DOCKER_HOST: tcp://docker:2375`
    -   `DOCKER_TLS_CERTDIR: ""` (Disables TLS for the Docker daemon connection within the job environment - use with caution).
-   **Deployment Credentials:** To push images to Docker Hub, configure these GitLab CI/CD variables:
    -   `DOCKER_USERNAME`: Your Docker Hub username.
    -   `DOCKER_PASSWORD`: Your Docker Hub password or access token (Access token recommended).
-   **Notification Tokens (Optional):** For Slack notifications, create a Slack App/Webhook and store the token/URL as a GitLab CI/CD variable.

## Pipeline Stages Explained (`.gitlab-ci.yml`)

The following sections detail the typical stages found in the `.gitlab-ci.yml` file for this DevSecOps pipeline.

### 1. Build Stage

-   **Purpose:** Compiles the Java source code and packages the application into an executable JAR file.
-   **Example Job (`build`):**
    ```yaml
    build:
      stage: build
      tags:
        - docker # Use a runner with the 'docker' tag
      image: maven:3.9.6-eclipse-temurin-17 # Use a Maven/Java image
      script:
        - mvn clean package -DskipTests # Compile and package, skip tests for speed
      artifacts:
        paths:
          - target/*.jar # Save the generated JAR file for later stages
    ```
-   **Key Concepts:**
    -   `stage: build`: Assigns the job to the 'build' stage.
    -   `image`: Specifies the Docker image to run the job in.
    -   `script`: The command(s) to execute.
    -   `artifacts`: Defines files to be saved and passed to subsequent stages.

### 2. Test Stage

-   **Purpose:** Executes automated tests (unit, integration) to verify code correctness.
-   **Example Job (`test`):**
    ```yaml
    test:
      stage: test
      tags:
        - docker
      image: maven:3.9.6-eclipse-temurin-17
      dependencies:
        - build # Requires the JAR artifact from the 'build' job
      script:
        - mvn test # Run tests using Maven
      artifacts:
        when: always # Save reports even if tests fail
        reports:
          junit: target/surefire-reports/TEST-*.xml # Collect JUnit reports for GitLab UI
    ```
-   **Key Concepts:**
    -   `dependencies`: Specifies jobs whose artifacts are needed.
    -   `artifacts:reports:junit`: Allows GitLab to parse test results and display them in the UI.

### 3. SAST Stage (Static Application Security Testing)

-   **Purpose:** Analyzes the source code for potential security vulnerabilities, bugs, and code quality issues without executing the code.
-   **Example Job (`sonarcloud-check` using SonarCloud):**
    ```yaml
    variables:
      SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar" # Defines cache directory for Sonar
      GIT_DEPTH: "0" # Fetch full Git history for better analysis

    sonarcloud-check:
      stage: sast
      tags:
        - docker
      image: maven:3.9.6-eclipse-temurin-17
      cache:
        key: "${CI_JOB_NAME}"
        paths:
          - .sonar/cache # Cache Sonar analysis files
      script:
        - mvn verify sonar:sonar -Dsonar.projectKey=your_project_key -Dsonar.organization=your_org_key # Run Sonar analysis
      only:
        - merge_requests
        - main # Or your main branches
        - develop
    ```
-   **Key Concepts:**
    -   `variables`: `GIT_DEPTH: "0"` is crucial for SonarCloud's analysis.
    -   `cache`: Speeds up subsequent runs.
    -   `script`: Invokes the Sonar scanner via Maven.
    -   `only`: Restricts when the job runs (e.g., only on merge requests and specific branches).

### 4. Dependency Scan Stage

-   **Purpose:** Scans project dependencies (e.g., libraries listed in `pom.xml`) for known vulnerabilities.
-   **Example Job (`dependency-check` using OWASP Dependency-Check):**
    ```yaml
    dependency-check:
      stage: dependancy-scan # Note: Typo in original stage name
      tags:
        - docker
      image:
        name: owasp/dependency-check:latest
        entrypoint: [""] # Override default entrypoint
      script:
        - /usr/share/dependency-check/bin/dependency-check.sh --project "MyProject" --scan "${CI_PROJECT_DIR}" --format "HTML" --out "${CI_PROJECT_DIR}/dependency-check-report"
      artifacts:
        when: always
        paths:
          - dependency-check-report/
    ```
-   **Key Concepts:**
    -   `image:name`: Uses a dedicated image containing the scanning tool.
    -   `image:entrypoint: [""]`: Prevents the image's default command from running, allowing the `script` section to take full control. *Failure to set this can cause the script commands to be ignored.*
    -   `script`: Runs the scanner and specifies the output format (HTML) and location.
    -   `artifacts`: Saves the generated HTML report.

### 5. Container Build Stage

-   **Purpose:** Builds a Docker image containing the application and its dependencies.
-   **Example Job (`docker-build`):**
    ```yaml
    docker-build:
      stage: container-build
      tags:
        - docker
      image: docker:latest # Use an image with Docker CLI
      services:
        - name: docker:dind # Start Docker-in-Docker service
          alias: docker # Alias for the service hostname
      variables:
        DOCKER_HOST: tcp://docker:2375 # Connect to the dind service
        DOCKER_TLS_CERTDIR: "" # Disable TLS for dind connection
      dependencies:
        - build # Needs the JAR file from the build stage
      script:
        # Use CI variables for dynamic image tagging
        - IMAGE_TAG="$CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA"
        - echo "Building image: $IMAGE_TAG"
        - docker build -t "$IMAGE_TAG" . # Build the image using Dockerfile in root
        - echo "Saving image to image.tar"
        - docker save "$IMAGE_TAG" -o image.tar # Save the image as a tarball
      artifacts:
        paths:
          - image.tar # Pass the image tarball to the next stage
    ```
-   **Key Concepts:**
    -   `image: docker:latest`: Provides the `docker` command.
    -   `services: docker:dind`: Enables building Docker images within the CI job.
    -   `variables`: Configure connection to the `dind` service.
    -   `script`: Uses `docker build` to create the image and `docker save` to export it.
    -   `artifacts`: Saves the `image.tar` file.

### 6. Container Scan Stage

-   **Purpose:** Scans the built Docker image for known vulnerabilities in the OS packages and application layers.
-   **Example Job (`docker-scan` using Trivy):**
    ```yaml
    docker-scan:
      stage: container-scan
      tags:
        - docker
      image:
        name: aquasec/trivy:latest
        entrypoint: [""]
      dependencies:
        - docker-build # Needs the image.tar artifact
      script:
        - trivy image --input image.tar --format template --template "@/contrib/html.tpl" --output trivy-report.html # Generate HTML report
        # Scan again for high/critical issues and fail job if found (optional)
        - trivy image --input image.tar --severity HIGH,CRITICAL --exit-code 1 || echo "High/Critical vulnerabilities found! Check report."
      artifacts:
        when: always
        paths:
          - trivy-report.html # Save the HTML report
    ```
-   **Key Concepts:**
    -   `image:name`: Uses the Trivy scanner image.
    -   `dependencies`: Requires the `image.tar` from the previous stage.
    -   `script`: Runs Trivy against the `image.tar`, generates an HTML report, and optionally fails the job if high/critical severity vulnerabilities are detected (`--exit-code 1`).

### 7. Deploy Stage

-   **Purpose:** Pushes the built and scanned Docker image to a container registry (e.g., Docker Hub, GitLab Container Registry).
-   **Example Job (`deploy` to Docker Hub):**
    ```yaml
    deploy:
      stage: deploy
      tags:
        - docker
      image: docker:latest
      services:
        - name: docker:dind
          alias: docker
      variables:
        DOCKER_HOST: tcp://docker:2375
        DOCKER_TLS_CERTDIR: ""
      dependencies:
        - docker-build # Needs the image.tar artifact
      script:
        - docker load -i image.tar # Load the image from the tarball
        # Use CI variables for credentials (defined in GitLab settings)
        - docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
        # Tag image appropriately (e.g., latest and commit SHA)
        - LOCAL_IMAGE_TAG="$CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA"
        - HUB_IMAGE_LATEST="$DOCKER_HUB_REPO:latest"
        - HUB_IMAGE_COMMIT="$DOCKER_HUB_REPO:$CI_COMMIT_SHORT_SHA"
        - docker tag "$LOCAL_IMAGE_TAG" "$HUB_IMAGE_LATEST"
        - docker tag "$LOCAL_IMAGE_TAG" "$HUB_IMAGE_COMMIT"
        # Push tags to Docker Hub
        - docker push "$HUB_IMAGE_LATEST"
        - docker push "$HUB_IMAGE_COMMIT"
      only:
        - main # Deploy only from the main branch
    ```
-   **Key Concepts:**
    -   `script`: Loads the image (`docker load`), logs into the registry (`docker login`), tags the image with desired names (`docker tag`), and pushes it (`docker push`).
    -   `only`: Often restricted to specific branches (like `main`) to control deployments.

### 8. DAST Stage (Dynamic Application Security Testing - Optional)

-   **Purpose:** Tests the *running* application for vulnerabilities by interacting with its exposed endpoints.
-   **Example Job (`dast-zap` using OWASP ZAP Baseline Scan):**
    ```yaml
    dast-zap:
      stage: dast # Or a custom stage name
      tags:
        - docker
      image: docker:latest
      services:
        - name: docker:dind
          alias: docker
      variables:
        DOCKER_HOST: tcp://docker:2375
        DOCKER_TLS_CERTDIR: ""
      dependencies:
        - docker-build # Needs the image to run
      script:
        - docker load -i image.tar
        - APP_IMAGE_TAG="$CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA"
        # Start the application container in the background
        - docker run -d --name my-app -p 8080:8080 "$APP_IMAGE_TAG"
        - sleep 30 # Wait for the application to start
        # Run ZAP baseline scan against the running application
        # Assumes the app is accessible within the job network at http://my-app:8080
        - docker run --network host -v $(pwd)/zap-report:/zap/wrk/:rw owasp/zap2docker-stable zap-baseline.py -t http://localhost:8080 -g gen.conf -r zap-report.html || echo "ZAP scan completed"
      artifacts:
        when: always
        paths:
          - zap-report/
    ```
-   **Key Concepts:**
    -   Requires starting the application container within the job.
    -   Uses a DAST tool (like OWASP ZAP) Docker image to scan the application's URL.
    -   Network configuration (`--network host` or linking containers) is crucial for ZAP to reach the application.
    -   Saves the DAST report as an artifact.

### 9. Notify Stage (Optional)

-   **Purpose:** Sends notifications about pipeline status (success/failure) to communication channels like Slack.
-   **Implementation:** Typically involves using `curl` or dedicated tools/images to send messages to webhook URLs, often using tokens stored in CI variables.

## Expected Outcome

The successful implementation of this task results in a fully automated, robust, and secure CI/CD pipeline. This pipeline integrates DevSecOps best practices, enabling rapid and secure delivery of the Spring Boot application. Key benefits include reduced manual effort, enhanced code quality through automated testing and scanning, and early mitigation of security risks within the development lifecycle.

