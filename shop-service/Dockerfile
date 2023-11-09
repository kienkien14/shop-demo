#base image: linux alpine os with open jdk 8
#Dockerfile - cmd vao folder chua Dockerfile
FROM eclipse-temurin:11-jre-alpine
#copy jar from local into docker image
COPY target/project3-0.1.jar project3-0.1.jar
#command line to run jar
ENTRYPOINT ["java","-jar","/project3-0.1.jar"]