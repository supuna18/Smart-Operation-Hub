# 1 වන පියවර: Maven සහ Temurin JDK 17 භාවිතා කර JAR file එක build කිරීම
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# mvnw file එකට run කරන්න permissions ලබා දීම
RUN chmod +x mvnw
# Project එක build කිරීම
RUN ./mvnw clean package -DskipTests

# 2 වන පියවර: සැහැල්ලු JRE 17 image එකක් භාවිතා කර Application එක run කිරීම
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]