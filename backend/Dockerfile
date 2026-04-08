# Step 1: Build stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY . .
# mvnw එකට permission දීලා බිල්ඩ් එක කරනවා
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Step 2: Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Build stage එකේදී හැදුණු jar එක මෙතනට කොපි කරනවා
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]cd..