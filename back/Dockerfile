FROM adoptopenjdk/openjdk11
COPY ./back/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]