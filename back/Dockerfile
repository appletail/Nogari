FROM adoptopenjdk/openjdk11
ARG JAR_FILE_PATH=./back/target/*.jar
COPY ${JAR_FILE_PATH} app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]