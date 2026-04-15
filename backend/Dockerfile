# Step 1: Build stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# මුලින්ම pom.xml සහ mvnw කොපි කරලා dependencies download කරගන්න (Cache එක පාවිච්චි කරන්න පුළුවන් එතකොට)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# ඉතිරි source code ටික කොපි කරලා build කරනවා
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Step 2: Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Build stage එකේදී හැදුණු jar එක මෙතනට කොපි කරනවා
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082

# මෙතන කිසිම අමතර අකුරක් (උදා: cd..) තියෙන්න බැහැ
ENTRYPOINT ["java", "-jar", "app.jar"]dock