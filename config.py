import os

class Config:
    DEBUG = os.getenv("ONTOLOGY_DEBUG", "True") == "True"
    ONTOLOGY_FILE = os.getenv("ONTOLOGY_FILE", "ontology_data.ttl")

# Environment Variables:
# ONTOLOGY_DEBUG: Set to 'True' for debug mode, 'False' for production.
# ONTOLOGY_FILE: Path to ontology data file (default: ontology_data.ttl)
# JWT_SECRET: Secret key for JWT authentication (default: 'supersecret')
# You can set these in a .env file or your deployment environment.
