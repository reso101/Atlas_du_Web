# -*- coding: utf-8 -*-
# Relations rétroactives : chaque entrée pointe vers l'une des 13 fiches
# fondations nouvellement créées, justifiée par une citation explicite déjà
# présente dans sa description (vérifiée automatiquement, faux positifs
# linguistiques exclus -- ex. 'envoyé' en français ne compte pas pour Envoy).

RETROFIT = {
    # Redis
    "asynq": ["DEPENDS_ON:redis"],
    "bee-queue": ["DEPENDS_ON:redis"],
    "bullmq": ["DEPENDS_ON:redis"],
    "celery": ["DEPENDS_ON:redis", "DEPENDS_ON:rabbitmq"],
    "dragonfly": ["CONCURRENCE:redis"],
    "delayed_job": ["CONCURRENCE:redis", "DEPENDS_ON:rails"],

    # MongoDB
    "agenda": ["DEPENDS_ON:mongodb"],
    "debezium": ["DEPENDS_ON:mongodb", "DEPENDS_ON:postgresql"],
    "arangodb": ["CONCURRENCE:mongodb"],
    "bdd": ["EVOLVES_INTO:mongodb", "EVOLVES_INTO:postgresql"],

    # PostgreSQL
    "citus": ["DEPENDS_ON:postgresql"],
    "supabase": ["DEPENDS_ON:postgresql"],
    "sql": ["EVOLVES_INTO:postgresql"],

    # RabbitMQ
    "dotnetcorecap": ["DEPENDS_ON:rabbitmq"],

    # gRPC / Protocol Buffers / OpenAPI
    "buf": ["DEPENDS_ON:grpc", "DEPENDS_ON:protocol_buffers"],
    "contract_first": ["DEPENDS_ON:grpc", "DEPENDS_ON:openapi"],
    "api_first": ["DEPENDS_ON:openapi"],
    "fastapi": ["DEPENDS_ON:openapi"],
    "fern": ["DEPENDS_ON:openapi"],

    # Laravel / Symfony
    "adonisjs": ["INFLUENCE:laravel"],
    "cakephp": ["CONCURRENCE:laravel", "CONCURRENCE:symfony"],
    "codeigniter": ["CONCURRENCE:laravel", "CONCURRENCE:symfony"],
    "php5": ["EVOLVES_INTO:laravel", "EVOLVES_INTO:symfony"],

    # Ruby on Rails
    "blitz": ["INFLUENCE:rails"],
    "redwood": ["INFLUENCE:rails"],
    "elixir": ["INFLUENCE:rails"],

    # Microservices
    "bounded_context": ["DEPENDS_ON:microservices"],
    "camunda": ["DEPENDS_ON:microservices"],
    "conductor": ["DEPENDS_ON:microservices"],
    "contract_testing": ["DEPENDS_ON:microservices"],
    "ddd": ["INFLUENCE:microservices"],
    "event-driven_archite": ["DEPENDS_ON:microservices"],
    "aspnet_core": ["DEPENDS_ON:microservices"],
}

if __name__ == "__main__":
    total = sum(len(v) for v in RETROFIT.values())
    print(f"{len(RETROFIT)} fiches concernées, {total} relations rétroactives.")
