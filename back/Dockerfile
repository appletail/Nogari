FROM adoptopenjdk/openjdk11
ARG JAR_FILE_PATH=target/nograi-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]