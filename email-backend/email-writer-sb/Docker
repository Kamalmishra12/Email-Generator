# ---------- build stage ----------
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace

# copy pom first to cache dependencies
COPY pom.xml .

# go offline to cache dependencies faster on rebuilds
RUN mvn -B -ntp dependency:go-offline

# copy source and build
COPY src ./src
RUN mvn -B -DskipTests package

# ---------- runtime stage ----------
FROM eclipse-temurin:21-jre-jammy
ARG JAR_FILE=target/email-writer-sb-0.0.1-SNAPSHOT.jar
WORKDIR /app

# copy jar from build stage
COPY --from=build /workspace/${JAR_FILE} app.jar

# create non-root user for safer runtime
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# change if your app runs on another port
EXPOSE 8080

# optional healthcheck - note: works if you have actuator or a health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar"]
