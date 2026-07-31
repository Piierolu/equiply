FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN sh ./mvnw -B dependency:go-offline
COPY src src
RUN sh ./mvnw -B package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S equiply && adduser -S equiply -G equiply
USER equiply
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
