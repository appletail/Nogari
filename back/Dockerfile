FROM adoptopenjdk/openjdk11
COPY ./key.json key.json
ARG JAR_FILE_PATH=target/*.jar
COPY ${JAR_FILE_PATH} app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]