# Step 1: Build stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Maven wrapper සහ dependencies මුලින්ම ලෑස්ති කරගන්නවා (Build එක වේගවත් කිරීමට)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Source code එක කොපි කරලා build කරනවා
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Step 2: Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Build stage එකේ හැදුණු නිවැරදි JAR එක app.jar නමින් කොපි කරනවා
# (ඔයාගේ project එකේ හැදෙන්නේ CampusHub-0.0.1-SNAPSHOT.jar කියන එකයි)
COPY --from=build /app/target/CampusHub-0.0.1-SNAPSHOT.jar app.jar

# Backend එක run වෙන port එක
EXPOSE 8082

# Application එක start කරන command එක
ENTRYPOINT ["java", "-jar", "app.jar"]