# ---- 1) compila o jar com Maven ----
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

# ---- 2) imagem final, só com o JRE ----
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# limita a memória do Java (o plano gratuito do Render tem 512 MB)
ENV JAVA_TOOL_OPTIONS="-Xmx350m"

# O Render define a variável PORT; localmente o padrão é 8080 (veja application.properties)
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
