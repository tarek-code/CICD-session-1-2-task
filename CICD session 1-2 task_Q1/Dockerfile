FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
# تثبيت curl
RUN apk add --no-cache curl
ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]