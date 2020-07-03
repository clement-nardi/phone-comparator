#Setup
Download and install:

 - Docker desktop
 - Git
 
 Then open Git bash and launch these commands:

    docker volume create mongoVolume
    docker run --name mongo-db -v mongoVolume:/data/db -d mongo
    docker run -p 8081:8081 --link mongo-db:mongo mongo-express
